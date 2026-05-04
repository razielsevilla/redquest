const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('./db');
const { getCompatibleDonorTypes } = require('./utils');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// POST /auth/register
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, blood_type, lat, lng } = req.body;

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let locationQuery = 'NULL';
    let values = [name, email, phone, hashedPassword, role, blood_type];

    if (lat && lng) {
      locationQuery = 'ST_SetSRID(ST_MakePoint($7, $8), 4326)';
      values.push(lng, lat);
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role, blood_type, location)
       VALUES ($1, $2, $3, $4, $5, $6, ${locationQuery}) RETURNING id, name, email, role`,
      values
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /users/me
app.get('/users/me', authenticateToken, async (req, res) => {
  try {
    // ST_AsGeoJSON is useful for returning the location as a JSON object instead of binary geography type
    const result = await pool.query(
      `SELECT id, name, email, phone, role, blood_type, 
              ST_AsGeoJSON(location) as location, is_available, 
              cooldown_until, xp, level, donation_count 
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    if (user.location) {
      user.location = JSON.parse(user.location);
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /requests
app.post('/requests', authenticateToken, async (req, res) => {
  try {
    const { blood_type, hospital_id, units_needed = 1, urgency = 'standard', notes } = req.body;
    const requester_id = req.user.id;

    // 1. Get hospital location
    const hospitalRes = await pool.query('SELECT * FROM hospitals WHERE id = $1', [hospital_id]);
    if (hospitalRes.rows.length === 0) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    const hospital = hospitalRes.rows[0];

    // 2. Create the blood request
    const requestRes = await pool.query(
      `INSERT INTO blood_requests (requester_id, hospital_id, blood_type, units_needed, urgency, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [requester_id, hospital_id, blood_type, units_needed, urgency, notes]
    );
    const newRequest = requestRes.rows[0];

    // 3. Find top 5 compatible donors within 10 km (10000 meters)
    const compatibleTypes = getCompatibleDonorTypes(blood_type);
    
    // Using ST_DWithin for 10km radius and ST_Distance to sort by closest
    const donorsRes = await pool.query(
      `SELECT id, ST_Distance(location, $1) as distance_meters
       FROM users 
       WHERE role = 'donor' 
       AND is_available = true 
       AND blood_type = ANY($2::varchar[])
       AND location IS NOT NULL
       AND id != $3
       AND ST_DWithin(location, $1, 10000)
       ORDER BY distance_meters ASC
       LIMIT 5`,
      [hospital.location, compatibleTypes, requester_id]
    );

    const matchedDonors = donorsRes.rows;

    // 4. Create quest records for matched donors
    if (matchedDonors.length > 0) {
      const questValues = matchedDonors.map(donor => 
        `('${newRequest.id}', '${donor.id}', ${Math.round(donor.distance_meters)})`
      ).join(',');

      await pool.query(`
        INSERT INTO quests (request_id, donor_id, distance_meters)
        VALUES ${questValues}
      `);
    }

    res.status(201).json({
      request: newRequest,
      donors_matched: matchedDonors.length,
      message: 'Request created and matching process started'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create blood request' });
  }
});

// GET /requests/:id
app.get('/requests/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the request details
    const requestRes = await pool.query(
      `SELECT r.*, h.name as hospital_name, h.address as hospital_address
       FROM blood_requests r
       JOIN hospitals h ON r.hospital_id = h.id
       WHERE r.id = $1`,
      [id]
    );

    if (requestRes.rows.length === 0) {
      return res.status(404).json({ error: 'Blood request not found' });
    }

    const request = requestRes.rows[0];

    // Fetch the associated quests and donor info
    const questsRes = await pool.query(
      `SELECT q.id, q.status, q.distance_meters, q.notified_at,
              u.name as donor_name, u.blood_type as donor_blood_type
       FROM quests q
       JOIN users u ON q.donor_id = u.id
       WHERE q.request_id = $1`,
      [id]
    );

    request.quests = questsRes.rows;

    res.json({ request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

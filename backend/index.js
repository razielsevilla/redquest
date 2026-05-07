const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('./db');
const { getCompatibleDonorTypes } = require('./utils');
const { sendQuestPushNotification } = require('./push');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';
const QUEST_EXPIRY_MS = 5 * 60 * 1000;
const activeQuestTimers = new Map();

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

async function logNotification({ userId, type, title, body, data }) {
  await pool.query(
    `INSERT INTO notifications (user_id, type, title, body, data)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [userId, type, title, body, JSON.stringify(data || {})]
  );
}

function clearQuestTimer(questId) {
  const timer = activeQuestTimers.get(questId);
  if (timer) {
    clearTimeout(timer);
    activeQuestTimers.delete(questId);
  }
}

async function activateNextQuest(requestId) {
  const nextQuestResult = await pool.query(
    `SELECT q.id, q.request_id, q.donor_id, q.distance_meters, q.expires_at, u.name, u.blood_type, u.device_token, h.name AS hospital_name
     FROM quests q
     JOIN blood_requests br ON br.id = q.request_id
     JOIN users u ON u.id = q.donor_id
     JOIN hospitals h ON h.id = br.hospital_id
     WHERE q.request_id = $1
       AND q.status = 'pending'
       AND q.notified_at IS NULL
     ORDER BY q.distance_meters ASC NULLS LAST, q.created_at ASC
     LIMIT 1`,
    [requestId]
  );

  const nextQuest = nextQuestResult.rows[0];
  if (!nextQuest) {
    await pool.query(
      `UPDATE blood_requests
       SET status = CASE WHEN status = 'complete' THEN status ELSE 'escalated' END,
           updated_at = NOW()
       WHERE id = $1`,
      [requestId]
    );
    return null;
  }

  await pool.query(
    `UPDATE quests
     SET notified_at = NOW()
     WHERE id = $1`,
    [nextQuest.id]
  );

  await pool.query(
    `UPDATE blood_requests
     SET status = 'notified', updated_at = NOW()
     WHERE id = $1`,
    [requestId]
  );

  await logNotification({
    userId: nextQuest.donor_id,
    type: 'quest_alert',
    title: 'New quest available',
    body: `Blood request for ${nextQuest.hospital_name} is waiting for you.`,
    data: {
      request_id: nextQuest.request_id,
      quest_id: nextQuest.id,
      blood_type: nextQuest.blood_type,
      distance_meters: nextQuest.distance_meters,
      expires_at: nextQuest.expires_at,
    },
  });

  await sendQuestPushNotification({
    token: nextQuest.device_token,
    title: 'New quest available',
    body: `Blood request for ${nextQuest.hospital_name} is waiting for you.`,
    data: {
      request_id: nextQuest.request_id,
      quest_id: nextQuest.id,
      blood_type: nextQuest.blood_type,
      distance_meters: nextQuest.distance_meters,
      expires_at: nextQuest.expires_at,
    },
  });

  const timer = setTimeout(() => {
    handleQuestExpiry(nextQuest.id).catch((error) => {
      console.error('Quest expiry failed:', error);
    });
  }, QUEST_EXPIRY_MS);

  activeQuestTimers.set(nextQuest.id, timer);

  return nextQuest;
}

async function handleQuestExpiry(questId) {
  clearQuestTimer(questId);

  const questResult = await pool.query(
    `SELECT id, request_id, status
     FROM quests
     WHERE id = $1`,
    [questId]
  );

  const quest = questResult.rows[0];
  if (!quest || quest.status !== 'pending') {
    return null;
  }

  await pool.query(
    `UPDATE quests
     SET status = 'expired', responded_at = NOW()
     WHERE id = $1`,
    [questId]
  );

  return activateNextQuest(quest.request_id);
}

async function findCompatibleDonors(hospitalId, bloodType, searchRadiusMeters) {
  const compatibleDonorTypes = getCompatibleDonorTypes(bloodType);

  if (!compatibleDonorTypes.length) {
    return [];
  }

  const donorsResult = await pool.query(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.blood_type,
       u.device_token,
       ROUND(ST_Distance(u.location, h.location))::integer AS distance_meters
     FROM users u
     JOIN hospitals h ON h.id = $1
     WHERE u.role = 'donor'
       AND u.is_available = true
       AND u.location IS NOT NULL
       AND u.blood_type = ANY($2::text[])
       AND ST_DWithin(u.location, h.location, $3)
     ORDER BY distance_meters ASC
     LIMIT 5`,
    [hospitalId, compatibleDonorTypes, searchRadiusMeters]
  );

  return donorsResult.rows;
}

async function createRequestWithQuests({
  requesterId,
  hospitalId,
  bloodType,
  unitsNeeded,
  urgency,
  notes,
  searchRadiusMeters,
}) {
  const requestResult = await pool.query(
    `INSERT INTO blood_requests (requester_id, hospital_id, blood_type, units_needed, urgency, notes, search_radius_m, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'matching')
     RETURNING *`,
    [requesterId, hospitalId, bloodType, unitsNeeded, urgency, notes || null, searchRadiusMeters]
  );

  const request = requestResult.rows[0];
  const donors = await findCompatibleDonors(hospitalId, bloodType, searchRadiusMeters);
  const createdQuests = [];

  for (const donor of donors) {
    const questResult = await pool.query(
      `INSERT INTO quests (request_id, donor_id, status, notified_at, distance_meters)
       VALUES ($1, $2, 'pending', NULL, $3)
       RETURNING *`,
      [request.id, donor.id, donor.distance_meters]
    );

    createdQuests.push(questResult.rows[0]);
  }

  if (createdQuests.length > 0) {
    await activateNextQuest(request.id);
  }

  return { request, donors, quests: createdQuests };
}

async function getRequestDetails(requestId) {
  const requestResult = await pool.query(
    `SELECT
       br.*,
       h.name AS hospital_name,
       h.address AS hospital_address,
       h.city AS hospital_city,
       h.location AS hospital_location,
       json_build_object(
         'id', requester.id,
         'name', requester.name,
         'email', requester.email,
         'phone', requester.phone,
         'role', requester.role
       ) AS requester
     FROM blood_requests br
     JOIN hospitals h ON h.id = br.hospital_id
     JOIN users requester ON requester.id = br.requester_id
     WHERE br.id = $1`,
    [requestId]
  );

  const request = requestResult.rows[0];
  if (!request) {
    return null;
  }

  const questsResult = await pool.query(
    `SELECT
       q.*,
       json_build_object(
         'id', donor.id,
         'name', donor.name,
         'email', donor.email,
         'blood_type', donor.blood_type,
         'phone', donor.phone
       ) AS donor,
       json_build_object(
         'id', r.id,
         'status', r.status,
         'partner', r.partner,
         'rider_name', r.rider_name,
         'plate_number', r.plate_number,
         'eta_minutes', r.eta_minutes,
         'dispatched_at', r.dispatched_at
       ) AS rider
     FROM quests q
     JOIN users donor ON donor.id = q.donor_id
     LEFT JOIN riders r ON r.quest_id = q.id
     WHERE q.request_id = $1
     ORDER BY q.distance_meters ASC NULLS LAST, q.created_at ASC`,
    [requestId]
  );

  return {
    request,
    quests: questsResult.rows,
  };
}

async function acceptQuest(questId, donorId) {
  const questResult = await pool.query(
    `SELECT q.*, br.hospital_id, br.requester_id
     FROM quests q
     JOIN blood_requests br ON br.id = q.request_id
     WHERE q.id = $1`,
    [questId]
  );

  const quest = questResult.rows[0];
  if (!quest) {
    return { status: 404, body: { error: 'Quest not found' } };
  }

  if (quest.donor_id !== donorId) {
    return { status: 403, body: { error: 'This quest belongs to another donor' } };
  }

  if (quest.status !== 'pending') {
    return { status: 400, body: { error: 'Quest is no longer available' } };
  }

  clearQuestTimer(questId);

  await pool.query(
    `UPDATE quests
     SET status = 'accepted', responded_at = NOW()
     WHERE id = $1`,
    [questId]
  );

  await pool.query(
    `UPDATE blood_requests
     SET status = 'accepted', updated_at = NOW()
     WHERE id = $1`,
    [quest.request_id]
  );

  const riderResult = await pool.query(
    `INSERT INTO riders (quest_id, partner, status, rider_name, plate_number, eta_minutes)
     VALUES ($1, 'mock', 'dispatched', $2, $3, $4)
     RETURNING *`,
    [questId, 'Kuya Rider', 'RQ-2048', 4]
  );

  return { status: 200, body: { questId, rider: riderResult.rows[0] } };
}

async function declineQuest(questId, donorId) {
  const questResult = await pool.query(
    `SELECT *
     FROM quests
     WHERE id = $1`,
    [questId]
  );

  const quest = questResult.rows[0];
  if (!quest) {
    return { status: 404, body: { error: 'Quest not found' } };
  }

  if (quest.donor_id !== donorId) {
    return { status: 403, body: { error: 'This quest belongs to another donor' } };
  }

  if (quest.status !== 'pending') {
    return { status: 400, body: { error: 'Quest is no longer available' } };
  }

  clearQuestTimer(questId);

  await pool.query(
    `UPDATE quests
     SET status = 'declined', responded_at = NOW()
     WHERE id = $1`,
    [questId]
  );

  await activateNextQuest(quest.request_id);

  return { status: 200, body: { message: 'Quest declined' } };
}

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
    const {
      hospital_id,
      blood_type,
      units_needed,
      urgency,
      notes,
      search_radius_m,
    } = req.body;

    if (!hospital_id || !blood_type) {
      return res.status(400).json({ error: 'hospital_id and blood_type are required' });
    }

    const result = await createRequestWithQuests({
      requesterId: req.user.id,
      hospitalId: hospital_id,
      bloodType: blood_type,
      unitsNeeded: Number.isInteger(units_needed) ? units_needed : 1,
      urgency: urgency || 'standard',
      notes,
      searchRadiusMeters: search_radius_m || 10000,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// GET /requests/me
app.get('/requests/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT br.*, h.name as hospital_name 
       FROM blood_requests br
       JOIN hospitals h ON h.id = br.hospital_id
       WHERE br.requester_id = $1 
       ORDER BY br.created_at DESC`,
      [req.user.id]
    );
    res.json({ requests: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// GET /requests/hospital
app.get('/requests/hospital', authenticateToken, async (req, res) => {
  try {
    const hospitalStaffResult = await pool.query(`SELECT hospital_id FROM users WHERE id = $1`, [req.user.id]);
    const hospitalId = hospitalStaffResult.rows[0]?.hospital_id;

    if (!hospitalId) {
      return res.status(403).json({ error: 'Not associated with a hospital' });
    }

    const result = await pool.query(
      `SELECT br.*, h.name as hospital_name 
       FROM blood_requests br
       JOIN hospitals h ON h.id = br.hospital_id
       WHERE br.hospital_id = $1 
       ORDER BY br.created_at DESC`,
      [hospitalId]
    );
    res.json({ requests: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch hospital requests' });
  }
});

// GET /requests/:id
app.get('/requests/:id', authenticateToken, async (req, res) => {
  try {
    const result = await getRequestDetails(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// POST /quests/:id/accept
app.post('/quests/:id/accept', authenticateToken, async (req, res) => {
  try {
    const result = await acceptQuest(req.params.id, req.user.id);
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to accept quest' });
  }
});

// POST /quests/:id/decline
app.post('/quests/:id/decline', authenticateToken, async (req, res) => {
  try {
    const result = await declineQuest(req.params.id, req.user.id);
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to decline quest' });
  }
});
// GET /quests/active
app.get('/quests/active', authenticateToken, async (req, res) => {
  try {
    const activeQuestResult = await pool.query(
      `SELECT
         q.*,
         br.hospital_id, br.blood_type as request_blood_type, br.urgency, br.units_needed,
         h.name AS hospital_name, h.address AS hospital_address, h.location AS hospital_location,
         r.status AS rider_status, r.rider_name, r.plate_number, r.eta_minutes
       FROM quests q
       JOIN blood_requests br ON br.id = q.request_id
       JOIN hospitals h ON h.id = br.hospital_id
       LEFT JOIN riders r ON r.quest_id = q.id
       WHERE q.donor_id = $1 AND q.status IN ('pending', 'accepted')
       ORDER BY q.created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    const quest = activeQuestResult.rows[0];
    if (!quest) {
      return res.status(404).json({ error: 'No active quest found' });
    }

    res.json({ quest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch active quest' });
  }
});

// POST /checkin/simulate
app.post('/checkin/simulate', authenticateToken, async (req, res) => {
  try {
    const { quest_id } = req.body;

    const questResult = await pool.query(
      `SELECT q.*, br.urgency 
       FROM quests q
       JOIN blood_requests br ON br.id = q.request_id
       WHERE q.id = $1`,
      [quest_id]
    );

    const quest = questResult.rows[0];
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    if (quest.donor_id !== req.user.id) {
      return res.status(403).json({ error: 'This quest belongs to another donor' });
    }

    if (quest.status !== 'accepted') {
      return res.status(400).json({ error: 'Quest must be accepted to check in' });
    }

    // Mark quest as completed
    await pool.query(`UPDATE quests SET status = 'completed', responded_at = NOW() WHERE id = $1`, [quest_id]);
    
    // Mark blood request as complete
    await pool.query(`UPDATE blood_requests SET status = 'complete', updated_at = NOW() WHERE id = $1`, [quest.request_id]);
    
    // Calculate XP
    let xpGained = 200;
    if (quest.urgency === 'urgent') xpGained += 50;
    else if (quest.urgency === 'critical') xpGained += 100;

    // Get current user stats
    const userResult = await pool.query(`SELECT xp, level, donation_count FROM users WHERE id = $1`, [req.user.id]);
    const user = userResult.rows[0];
    
    const newXpTotal = (user.xp || 0) + xpGained;
    const newDonationCount = (user.donation_count || 0) + 1;
    
    // Level logic
    const getLevel = (xp) => {
      if (xp >= 12000) return 7; // Elite
      if (xp >= 6000) return 6;  // Legend
      if (xp >= 3000) return 5;  // Champion
      if (xp >= 1500) return 4;  // Hero
      if (xp >= 700) return 3;   // Guardian
      if (xp >= 300) return 2;   // Responder
      return 1;                  // Recruit
    };

    const newLevel = getLevel(newXpTotal);
    const leveledUp = newLevel > user.level;

    await pool.query(
      `UPDATE users 
       SET xp = $1, level = $2, donation_count = $3
       WHERE id = $4`,
      [newXpTotal, newLevel, newDonationCount, req.user.id]
    );

    res.json({
      message: 'Quest completed successfully',
      xp_gained: xpGained,
      new_xp: newXpTotal,
      leveled_up: leveledUp,
      new_level: newLevel
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete checkin' });
  }
});

// GET /hospitals
app.get('/hospitals', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hospitals ORDER BY name ASC');
    res.json({ hospitals: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});


// GET /quests/history
app.get('/quests/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT q.*, br.hospital_id, br.blood_type as request_blood_type, br.urgency, br.units_needed,
         h.name AS hospital_name, h.address AS hospital_address
       FROM quests q
       JOIN blood_requests br ON br.id = q.request_id
       JOIN hospitals h ON h.id = br.hospital_id
       WHERE q.donor_id = $1 AND q.status IN ('completed', 'declined', 'expired')
       ORDER BY q.created_at DESC`,
      [req.user.id]
    );
    res.json({ quests: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quest history' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

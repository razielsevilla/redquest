const { pool } = require('./db');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    console.log('Seeding data...');

    await pool.query('TRUNCATE notifications, quests, blood_requests, users, hospitals CASCADE');

    // ── Hospitals ──────────────────────────────────────────────────────────────
    await pool.query(`
      INSERT INTO hospitals (name, address, city, location) VALUES
        ('St. Luke''s Medical Center BGC', '5th Ave, Taguig', 'Taguig',
          ST_SetSRID(ST_MakePoint(121.0467, 14.5485), 4326)),
        ('Philippine General Hospital', 'Taft Ave, Manila', 'Manila',
          ST_SetSRID(ST_MakePoint(120.9840, 14.5650), 4326)),
        ('Makati Medical Center', '2 Amorsolo St, Makati', 'Makati',
          ST_SetSRID(ST_MakePoint(121.0194, 14.5587), 4326)),
        ('The Medical City', 'Ortigas Ave, Pasig', 'Pasig',
          ST_SetSRID(ST_MakePoint(121.0600, 14.5870), 4326)),
        ('Cardinal Santos Medical Center', '10 Wilson St, San Juan', 'San Juan',
          ST_SetSRID(ST_MakePoint(121.0338, 14.5997), 4326));
    `);

    const passwordHash = await bcrypt.hash('password123', 10);
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    // ── 15 Donors ──────────────────────────────────────────────────────────────
    const donorLocations = [
      { lng: 121.02, lat: 14.55 }, { lng: 121.03, lat: 14.56 },
      { lng: 121.04, lat: 14.57 }, { lng: 121.05, lat: 14.58 },
      { lng: 121.06, lat: 14.59 }, { lng: 120.98, lat: 14.54 },
      { lng: 120.99, lat: 14.55 }, { lng: 121.00, lat: 14.56 },
      { lng: 121.01, lat: 14.57 }, { lng: 121.02, lat: 14.58 },
      { lng: 121.03, lat: 14.59 }, { lng: 121.04, lat: 14.60 },
      { lng: 121.05, lat: 14.61 }, { lng: 121.06, lat: 14.62 },
      { lng: 121.07, lat: 14.63 },
    ];

    for (let i = 0; i < 15; i++) {
      const { lng, lat } = donorLocations[i];
      await pool.query(
        `INSERT INTO users (name, email, phone, password_hash, role, blood_type, location, is_available)
         VALUES ($1, $2, $3, $4, 'donor', $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), true)`,
        [`Donor ${i + 1}`, `donor${i + 1}@test.com`,
         `0917000${String(i + 1).padStart(4, '0')}`,
         passwordHash, bloodTypes[i % bloodTypes.length], lng, lat]
      );
    }

    // ── 3 Requesters ──────────────────────────────────────────────────────────
    const requesters = [
      { name: 'Maria Santos', email: 'requester1@test.com', phone: '09181000001', bt: 'O+',  lng: 121.0467, lat: 14.5485 },
      { name: 'Jose Reyes',   email: 'requester2@test.com', phone: '09181000002', bt: 'A+',  lng: 120.9840, lat: 14.5650 },
      { name: 'Ana Cruz',     email: 'requester3@test.com', phone: '09181000003', bt: 'B+',  lng: 121.0194, lat: 14.5587 },
    ];

    for (const r of requesters) {
      await pool.query(
        `INSERT INTO users (name, email, phone, password_hash, role, blood_type, location)
         VALUES ($1, $2, $3, $4, 'requester', $5, ST_SetSRID(ST_MakePoint($6, $7), 4326))`,
        [r.name, r.email, r.phone, passwordHash, r.bt, r.lng, r.lat]
      );
    }

    console.log('Seed complete: 5 hospitals | 15 donors | 3 requesters');
    console.log('Test login (password: password123)');
    console.log('  Donor:     donor1@test.com');
    console.log('  Requester: requester1@test.com');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    pool.end();
  }
};

seedData();

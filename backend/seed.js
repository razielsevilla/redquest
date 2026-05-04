const { pool } = require('./db');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    console.log('Seeding mock data...');

    // Clear existing data for idempotency (optional, but good for testing)
    await pool.query('TRUNCATE quests, blood_requests, hospitals, users CASCADE');

    // 1. Seed 3 Hospitals
    await pool.query(`
      INSERT INTO hospitals (name, address, city, location) VALUES
        ('St. Luke''s Medical Center BGC', '5th Ave, Taguig', 'Taguig', ST_SetSRID(ST_MakePoint(121.0467, 14.5485), 4326)),
        ('Philippine General Hospital', 'Taft Ave, Manila', 'Manila', ST_SetSRID(ST_MakePoint(120.9840, 14.5650), 4326)),
        ('Makati Medical Center', '2 Amorsolo St, Makati', 'Makati', ST_SetSRID(ST_MakePoint(121.0194, 14.5587), 4326));
    `);

    // 2. Seed 15 Donor Accounts
    const passwordHash = await bcrypt.hash('password123', 10);
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    
    // Coordinates around Metro Manila
    const locations = [
      { lng: 121.02, lat: 14.55 },
      { lng: 121.03, lat: 14.56 },
      { lng: 121.04, lat: 14.57 },
      { lng: 121.05, lat: 14.58 },
      { lng: 121.06, lat: 14.59 },
      { lng: 120.98, lat: 14.54 },
      { lng: 120.99, lat: 14.55 },
      { lng: 121.00, lat: 14.56 },
      { lng: 121.01, lat: 14.57 },
      { lng: 121.02, lat: 14.58 },
      { lng: 121.03, lat: 14.59 },
      { lng: 121.04, lat: 14.60 },
      { lng: 121.05, lat: 14.61 },
      { lng: 121.06, lat: 14.62 },
      { lng: 121.07, lat: 14.63 }
    ];

    for (let i = 0; i < 15; i++) {
      const bloodType = bloodTypes[i % bloodTypes.length];
      const { lng, lat } = locations[i];
      
      await pool.query(
        `INSERT INTO users (name, email, phone, password_hash, role, blood_type, location, is_available) 
         VALUES ($1, $2, $3, $4, 'donor', $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), true)`,
        [`Donor ${i+1}`, `donor${i+1}@test.com`, `091700000${i < 10 ? '0'+i : i}`, passwordHash, bloodType, lng, lat]
      );
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    pool.end();
  }
};

seedData();

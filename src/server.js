const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection details for CockroachDB on AWS
const pool = new Pool({
  user: 'supreme',
  host: 'stoic-duke-15588.7tt.aws-us-east-1.cockroachlabs.cloud',
  database: 'defaultdb',
  password: 'Z0lGvbB_Hs7Lvt104K2ZFw',
  port: 26257,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Endpoint to save user data
app.post('/api/save', async (req, res) => {
  const { username, password, email, phone, city, state, zipcode, item, role } = req.body;
  try {
    const table = role === 'renter' ? 'renters' : 'lenders';
    await pool.query(
      `INSERT INTO ${table} (username, password, email, phone, city, state, zipcode, item) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [username, password, email, phone, city, state, zipcode, item]
    );
    res.status(200).send('Data successfully added.');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// Endpoint to search for items
app.get('/api/search', async (req, res) => {
  const { zipcode, item } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM renters WHERE zipcode = $1 AND item ILIKE $2 UNION ALL SELECT * FROM lenders WHERE zipcode = $1 AND item ILIKE $2`,
      [zipcode, `%${item}%`]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error searching data', error);
    res.status(500).send('Error searching data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

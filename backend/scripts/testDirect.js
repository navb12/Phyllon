const { Client } = require('pg');
require('dotenv').config();

async function testRaw() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Testing direct connection to Neon PostgreSQL...');
    await client.connect();
    const res = await client.query('SELECT 1 as result;');
    console.log('Connection successful! Query returned:', res.rows[0]);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.end();
  }
}

testRaw();


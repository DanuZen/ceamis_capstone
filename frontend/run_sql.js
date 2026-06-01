const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL.replace('aws-1-ap-northeast-1', 'aws-0-ap-northeast-1').replace('5432', '6543'),
  ssl: { rejectUnauthorized: false }
});

client.connect().then(() => {
  const sql = fs.readFileSync('create_tables.sql', 'utf8');
  return client.query(sql);
}).then(() => {
  console.log('Success');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});

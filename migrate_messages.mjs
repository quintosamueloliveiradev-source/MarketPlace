import pg from 'pg';
const { Pool } = pg;
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log("No DB URL");
  process.exit(1);
}
const urlMatch = dbUrl.match(/^(postgres(?:ql)?:\/\/[^:]+:)(.*)(@[^@]+)$/);
if (urlMatch) {
  const prefix = urlMatch[1];
  let password = urlMatch[2];
  const suffix = urlMatch[3];
  password = password.replace(/\[/g, '%5B').replace(/\]/g, '%5D').replace(/#/g, '%23').replace(/@/g, '%40');
  dbUrl = prefix + password + suffix;
}

const isLocal = typeof dbUrl === 'string' && (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1'));
const pool = new Pool({
  connectionString: dbUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

async function run() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        ad_id INTEGER REFERENCES ads(id) ON DELETE CASCADE,
        sender_email VARCHAR(255) NOT NULL,
        receiver_email VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created messages table.");
    await client.release();
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();

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
    await client.query("ALTER TABLE ads ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);");
    console.log("Added user_email column.");
    await client.release();
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();

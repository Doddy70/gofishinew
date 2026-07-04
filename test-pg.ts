import { config } from "dotenv";
config();
import { Pool } from "pg";

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });
  console.log("Connecting...");
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("Success:", res.rows[0]);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();

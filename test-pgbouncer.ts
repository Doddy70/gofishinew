import { config } from "dotenv";
config();
process.env.DATABASE_URL = process.env.DATABASE_URL + "&pgbouncer=true";
import { getListing } from "./src/server-actions/getListing";

async function main() {
  console.log("Using DATABASE_URL with pgbouncer=true...");
  try {
    const listing = await getListing("cmr5o9aeb0005hvvdgg8b5epl");
    console.log(listing ? "Success! Found listing." : "Failed: Returned null");
  } catch (err) {
    console.error("Exception:", err);
  }
}

main().catch(console.error);

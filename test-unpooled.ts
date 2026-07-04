import { config } from "dotenv";
config();
process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED;

// dynamically import AFTER env is set
async function main() {
  const { getListing } = await import("./src/server-actions/getListing");
  console.log("Using DATABASE_URL_UNPOOLED...");
  try {
    const listing = await getListing("cmr5o9aeb0005hvvdgg8b5epl");
    console.log(listing ? "Success! Found listing." : "Failed: Returned null");
  } catch (err) {
    console.error("Exception:", err);
  }
}
main().catch(console.error);

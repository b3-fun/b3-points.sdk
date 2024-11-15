import { transferPointsCsv } from "./transfer-points";

// appId is the id of the application
const appId = BigInt(5);
// filePath is the path to the csv file
const filePath = "./src/example/bps/transfer-requests.csv";

async function distributePointsCsv() {
  try {
    await transferPointsCsv(filePath, appId);
  } catch (error) {
    console.error(error);
  }
}

// main: call the function to transfer points from a csv file
void distributePointsCsv();

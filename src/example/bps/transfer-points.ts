import process from "node:process";

import * as dotenv from "dotenv";
import * as fs from "node:fs/promises";
import readline from "node:readline";
import path from "path";
import type { Address, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { BPS } from "../../bps";
import { b3SepoliaConfig } from "../../config";
import type {
  ListPointTransfersOptions,
  Pagination,
  TransferRequest,
} from "../../types";

dotenv.config(); // Load environment variables from .env file

// default to sepolia, switch to mainnet by changing the config to b3MainnetConfig
const chainConfig = b3SepoliaConfig;
console.log("connect to chain", chainConfig.chain.name);
const appModeratorPrivateKey =
  `0x${process.env.MODERATOR_PRIVATE_KEY}` || `{0x}`;

export async function transferPoints(
  appId: bigint,
  transferRequests: TransferRequest[]
): Promise<string> {
  const bps = new BPS(
    chainConfig.indexerUrl,
    chainConfig.pointServiceContractAddress,
    chainConfig.chain
  );
  bps.connect();
  console.log(appModeratorPrivateKey);
  const response = await bps.transferPoints(
    appId,
    transferRequests,
    privateKeyToAccount(<Hex>appModeratorPrivateKey)
  );
  return response.toString();
}

//----- function to read transfer requests from a csv file -----
export async function readTransferRequestsFromCsv(
  csvPath: string
): Promise<TransferRequest[]> {
  try {
    const fullPath = path.resolve(csvPath);
    console.log("Reading from:", fullPath);
    const csv = await fs.readFile(fullPath, "utf-8");

    const rows = csv.split("\n").filter((row) => row.trim() !== "");
    // Skip the header row
    const dataRows = rows.slice(1);

    const transferRequests: TransferRequest[] = dataRows.map((row) => {
      const [recipientAddress, pointsAmount] = row.split(",");
      return {
        recipient: recipientAddress.trim() as Address,
        point: BigInt(pointsAmount.trim()),
      };
    });
    return transferRequests;
  } catch (error) {
    console.error("Error reading or processing CSV:", error);
    throw error;
  }
}

export async function listReceivedRecipients(
  appId: bigint
): Promise<Address[]> {
  const bps = new BPS(
    chainConfig.indexerUrl,
    chainConfig.pointServiceContractAddress,
    chainConfig.chain
  );

  bps.connect();
  const currentSession = await bps.getCurrentSession();
  // call listPointTransfers until pagination is empty
  let pagination: Pagination = { pageNumber: 1, pageSize: 100 };
  let receivedAddresses: Address[] = [];
  while (true) {
    const options: ListPointTransfersOptions = {
      appId,
      session: currentSession,
      status: "active",
      chainId: chainConfig.chain.id,
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    };
    const response = await bps.listPointTransfers(options);
    response.results.forEach((transfer) => {
      receivedAddresses.push(transfer.user as Address);
    });
    const pageInfo = response.pageInfo;
    if (!pageInfo.hasNextPage) {
      break;
    }
    pagination.pageNumber = (pagination.pageNumber ?? 0) + 1;
  }

  return receivedAddresses;
}

//----- function to transfer points from a csv file -----
export async function transferPointsCsv(csvPath: string, appId: bigint) {
  const transferRequests = await readTransferRequestsFromCsv(csvPath);
  const receivedAddresses = await listReceivedRecipients(appId);

  // filter out received addresses from transfer requests
  const filteredTransferRequests = transferRequests.filter(
    (request) => !receivedAddresses.includes(request.recipient)
  );

  console.log(
    `Number of transfer requests: ${transferRequests.length}, number of requests after filtered: ${filteredTransferRequests.length}`
  );

  // sum number of points to transfer
  const totalPoints = filteredTransferRequests.reduce(
    (sum, request) => sum + request.point,
    0n
  );
  console.log(
    `Total points to transfer: ${totalPoints}, total recipients: ${filteredTransferRequests.length}`
  );

  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Prompt if the user wants to continue
  const continueTransfer = await new Promise<string>((resolve) => {
    rl.question("Continue with transfer? (y/n) ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase());
    });
  });

  if (continueTransfer !== "y") {
    return;
  }

  if (filteredTransferRequests.length === 0) {
    console.log("No transfer requests to process");
    return;
  }

  // now split the filtered transfer requests into chunks of 100
  const chunks = filteredTransferRequests.reduce((acc, curr, index) => {
    const chunkIndex = Math.floor(index / 100);
    acc[chunkIndex] = [...(acc[chunkIndex] || []), curr];
    return acc;
  }, [] as TransferRequest[][]);
  // log number of transfer requests, and number of request has filtered

  // transfer points in chunks, sleep 5s between chunks to put in new block
  for (const chunk of chunks) {
    await transferPoints(appId, chunk);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

//----- function to distribute points -----
async function distributePoints() {
  const appId = 3n;
  const transferRequests: TransferRequest[] = [
    { recipient: "0x6dae59FA42b8D81A9ad1FB7cF9b47de35040f6A3", point: 10n },
  ];
  try {
    const response = await transferPoints(appId, transferRequests);
    console.log("transferPoints", response);
  } catch (error) {
    console.error(error);
  }
}

async function distributePointsCsv() {
  const appId = BigInt(5);
  const filePath = "./src/example/bps/transfer-requests.csv";
  try {
    await transferPointsCsv(filePath, appId);
  } catch (error) {
    console.error(error);
  }
}
// main: call the function to transfer points from a csv file
void distributePointsCsv();

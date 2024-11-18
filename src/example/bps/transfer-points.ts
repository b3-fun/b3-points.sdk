import process from "node:process";

import * as dotenv from "dotenv";
import * as fs from "node:fs/promises";
import readline from "node:readline";
import path from "path";
import type { Address, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { BPS } from "../../bps";
import { b3MainnetConfig, b3SepoliaConfig, Config } from "../../config";
import type {
  ListPointTransfersOptions,
  Pagination,
  TransferRequest,
} from "../../types";

dotenv.config(); // Load environment variables from .env file

// default to sepolia, switch to mainnet by changing the config to b3MainnetConfig
let chainConfig: Config;
if (process.env.CHAIN === "mainnet") {
  chainConfig = b3MainnetConfig;
} else {
  chainConfig = b3SepoliaConfig;
}

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
        recipient: recipientAddress
          .toLowerCase()
          .trim()
          .replace(/\n/g, "") as Address,
        point: BigInt(pointsAmount.trim()),
      };
    });
    return transferRequests;
  } catch (error) {
    console.error("Error reading or processing CSV:", error);
    throw error;
  }
}

type ReceivedPoints = {
  address: string;
  points: bigint;
};
export async function listReceivedRecipients(
  appId: bigint
): Promise<ReceivedPoints[]> {
  const bps = new BPS(
    chainConfig.indexerUrl,
    chainConfig.pointServiceContractAddress,
    chainConfig.chain
  );

  bps.connect();
  const currentSession = await bps.getCurrentSession();
  // call listPointTransfers until pagination is empty
  let pagination: Pagination = { pageNumber: 1, pageSize: 100 };
  let receivedPoints: ReceivedPoints[] = [];
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
      receivedPoints.push({
        address: transfer.user.toLowerCase().trim().replace(/\n/g, ""),
        points: BigInt(transfer.points.trim()),
      });
    });
    const pageInfo = response.pageInfo;
    if (!pageInfo.hasNextPage) {
      break;
    }
    pagination.pageNumber = (pagination.pageNumber ?? 0) + 1;
  }

  return receivedPoints;
}

//----- function to transfer points from a csv file -----
export async function transferPointsCsv(
  csvPath: string,
  appId: bigint,
  batchSize: number
) {
  console.log(`Start transfer points from ${csvPath}, appId: ${appId}`);
  const transferRequests = await readTransferRequestsFromCsv(csvPath);
  const receivedPoints = await listReceivedRecipients(appId);
  console.log(
    `Number of addresses already received points: ${receivedPoints.length}`
  );

  console.log(
    `Number of distributed points: ${receivedPoints.reduce(
      (sum, point) => sum + point.points,
      0n
    )}`
  );

  console.log("--------------------------------");
  const filteredTransferRequests = transferRequests.filter(
    (request) =>
      !receivedPoints.some(
        (point) => point.address === request.recipient.toLowerCase()
      )
  );

  console.log(
    `Number of requests in csv: ${transferRequests.length}, number of requests after filtered: ${filteredTransferRequests.length}`
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

  // now split the filtered transfer requests into chunks of batchSize
  const chunks = filteredTransferRequests.reduce((acc, curr, index) => {
    const chunkIndex = Math.floor(index / batchSize);
    acc[chunkIndex] = [...(acc[chunkIndex] || []), curr];
    return acc;
  }, [] as TransferRequest[][]);
  // log number of transfer requests, and number of request has filtered

  // transfer points in chunks, sleep 5s between chunks to put in new block
  let batchNumber = 0;
  for (const chunk of chunks) {
    const response = await transferPoints(appId, chunk);
    console.log("transferPoints tx hash", response);
    // check if the tx is included in the chain

    console.log(`Transferred batch ${batchNumber + 1} of ${chunks.length}`);
    batchNumber++;
  }
}

//----- function to distribute points -----
async function distributePoints() {
  const appId = 5n;
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

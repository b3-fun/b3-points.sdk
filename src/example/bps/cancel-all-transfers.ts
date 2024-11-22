import * as dotenv from "dotenv";

import readline from "node:readline";
import { PointTransfer } from "types";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { BPS } from "../../bps";
import { b3MainnetConfig, b3SepoliaConfig, Config } from "../../config";

// appId is the id of the application
const appId = BigInt(5);
dotenv.config(); // Load environment variables from .env file

const appModeratorPrivateKey =
  `0x${process.env.MODERATOR_PRIVATE_KEY}` || `{0x}`;
// default to sepolia, switch to mainnet by changing the config to b3MainnetConfig
let chainConfig: Config;
if (process.env.ENV === "mainnet") {
  console.log(`connect to ${process.env.ENV}`);
  chainConfig = b3MainnetConfig;
  console.log("connect to chain", b3MainnetConfig.chain.name);
} else {
  chainConfig = b3SepoliaConfig;
  console.log(`connect to ${process.env.ENV}`);
  console.log("connect to chain", b3SepoliaConfig.chain.name);
}

async function cancelAllTransfers() {
  try {
    const bps = new BPS(
      chainConfig.indexerUrl,
      chainConfig.pointServiceContractAddress,
      chainConfig.chain
    );
    bps.connect();
    // get all the transfer requests for the application
    const transferRequests = await getCurrentSeasonTransferRequests(bps, appId);
    // print out some transferRequest stats
    console.log(`found ${transferRequests.length} transfer requests`);
    // total Points to be cancelled
    const totalPoints = transferRequests.reduce(
      (acc, transfer) => acc + BigInt(transfer.points),
      BigInt(0)
    );
    console.log(`total Points to be cancelled: ${totalPoints}`);
    //ask if user wants to proceed
    // Create readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Prompt if the user wants to continue
    const continueTransfer = await new Promise<string>((resolve) => {
      rl.question("Continue with cancellation? (y/n) ", (answer) => {
        rl.close();
        resolve(answer.toLowerCase());
      });
    });

    if (continueTransfer !== "y") {
      return;
    }

    for (const transferRequest of transferRequests) {
      await bps.cancelTransfer(
        // transferRequest.id is already a hex string
        <Hex>transferRequest.id,
        privateKeyToAccount(<Hex>appModeratorPrivateKey)
      );
    }

    // cancel all the transfer requests
  } catch (error) {}
}

async function getCurrentSeasonTransferRequests(
  bps: BPS,
  appId: bigint
): Promise<PointTransfer[]> {
  const pointTransfers: PointTransfer[] = [];
  const currentSession = await bps.getCurrentSession();
  let hasNextPage = true;
  let pageNumber = 1;
  while (hasNextPage) {
    const transferRequests = await bps.listPointTransfers({
      appId,
      session: currentSession,
      pageNumber,
      pageSize: 100,
    });
    pointTransfers.push(...transferRequests.results);
    hasNextPage = transferRequests.pageInfo.hasNextPage;
    pageNumber++;
  }
  return pointTransfers;
}

// main: call the function to transfer points from a csv file
void cancelAllTransfers();

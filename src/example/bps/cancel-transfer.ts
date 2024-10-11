import process from "node:process";

import * as dotenv from "dotenv";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { BPS } from "../../bps";
import { b3SepoliaConfig } from "../../config";
dotenv.config(); // Load environment variables from .env file

const appModeratorPrivateKey =
  `0x${process.env.MODERATOR_PRIVATE_KEY}` || `{0x}`;

const chainConfig = b3SepoliaConfig;
export async function cancelTransfer(): Promise<string> {
  const bps = new BPS(
    chainConfig.indexerUrl,
    chainConfig.pointServiceContractAddress,
    chainConfig.chain
  );
  bps.connect();
  const response = await bps.cancelTransfer(
    "0x123456", // replace with existing transfer uid
    privateKeyToAccount(<Hex>appModeratorPrivateKey)
  );
  return response.toString();
}

void cancelTransfer().then((r) => console.log("cancelTransfer:", r));

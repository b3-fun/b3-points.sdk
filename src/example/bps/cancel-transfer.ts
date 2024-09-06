import process from "node:process";

import * as dotenv from "dotenv";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { b3Sepolia } from "viem/chains";

import { BPS } from "../../bps";
import {
  B3SepoliaPointIndexerURL,
  B3SepoliaPointServiceContractAddress,
} from "../../constants";

dotenv.config(); // Load environment variables from .env file

const appOperatorPrivateKey =
  `0x${process.env.OPERATOR_PRIVATE_KEY}` || `{0x}`;

export async function cancelTransfer(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointIndexerURL,
    B3SepoliaPointServiceContractAddress,
    b3Sepolia,
  );
  bps.connect();
  const response = await bps.cancelTransfer(
    "0x123456", // replace with existing transfer uid
    privateKeyToAccount(<Hex>appOperatorPrivateKey),
  );
  return response.toString();
}

void cancelTransfer().then((r) => console.log("cancelTransfer:", r));

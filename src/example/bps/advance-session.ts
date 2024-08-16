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

const b3AdminPrivateKey = `0x${process.env.B3_ADMIN_PRIVATE_KEY}` || `{0x}`;

export async function advanceSession(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointIndexerURL,
    B3SepoliaPointServiceContractAddress,
    b3Sepolia,
  );
  bps.connect();
  const response = await bps.advanceSession(
    privateKeyToAccount(<Hex>b3AdminPrivateKey),
  );
  return response.toString();
}

void advanceSession().then((r) => console.log("advanceSession:", r));

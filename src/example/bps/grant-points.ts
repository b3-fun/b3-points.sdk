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

const b3AdminPrivateKey: Hex =
  `0x${process.env.B3_ADMIN_PRIVATE_KEY}` || `{0x}`;

export async function grantPoints(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointIndexerURL,
    B3SepoliaPointServiceContractAddress,
    b3Sepolia,
  );
  bps.connect();
  const response = await bps.grantPoints(
    [
      {
        appId: 3n,
        point: 20n,
      },
    ],
    privateKeyToAccount(b3AdminPrivateKey),
  );
  return response.toString();
}

void grantPoints().then((r) => console.log("grantPoints:", r));

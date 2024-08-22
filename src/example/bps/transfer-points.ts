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

const appModeratorPrivateKey =
  `0x${process.env.MODERATOR_PRIVATE_KEY}` || `{0x}`;

export async function transferPoints(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointIndexerURL,
    B3SepoliaPointServiceContractAddress,
    b3Sepolia,
  );
  bps.connect();
  const response = await bps.transferPoints(
    3n,
    [
      {
        recipient: "0x6dae59FA42b8D81A9ad1FB7cF9b47de35040f6A3",
        point: 10n,
      },
    ],
    privateKeyToAccount(<Hex>appModeratorPrivateKey),
  );
  return response.toString();
}

void transferPoints().then((r) => console.log("transferPoints", r));

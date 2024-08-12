import * as process from "node:process";

import * as dotenv from "dotenv";
import type { App, ListQueryResponse } from "types";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { b3Sepolia } from "viem/chains";

import { AppRegistry } from "../appRegistry";
import {
  B3PointIndexerURLOnB3Sepolia,
  B3SepoliaAppRegistryContractAddress,
} from "../constants";

dotenv.config(); // Load environment variables from .env file

const appModeratorPrivateKey =
  `0x${process.env.B3_ADMIN_PRIVATE_KEY}` || `{0x}`;

export async function registerApp(): Promise<string> {
  const registry = new AppRegistry(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaAppRegistryContractAddress,
    b3Sepolia,
  );
  console.log(appModeratorPrivateKey);
  registry.connect();
  const resp = await registry.register(
    "asdf.b3.fun",
    "0xB90d8162a3A1a2d760699F1f08c5F0cdAe1808F9",
    privateKeyToAccount(<Hex>appModeratorPrivateKey),
  );
  return resp.toString();
}
export async function listApps(): Promise<ListQueryResponse<App>> {
  const registry = new AppRegistry(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaAppRegistryContractAddress,
    b3Sepolia,
  );

  return await registry.listApps({
    rankings: { direction: "DESC", attribute: "createdAt" },
    pageNumber: 1,
    pageSize: 10,
  });
}

import * as process from "node:process";

import * as dotenv from "dotenv";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { AppRegistry } from "../../appRegistry";
import { b3SepoliaConfig } from "../../config";
dotenv.config(); // Load environment variables from .env file

const appModeratorPrivateKey =
  `0x${process.env.MODERATOR_PRIVATE_KEY}` || `{0x}`;

export async function registerApp(): Promise<string> {
  const chainConfig = b3SepoliaConfig;
  const registry = new AppRegistry(
    chainConfig.indexerUrl,
    chainConfig.appRegistryContractAddress,
    chainConfig.chain
  );
  registry.connect();
  const resp = await registry.register(
    "b3.b3.fun",
    "0xB90d8162a3A1a2d760699F1f08c5F0cdAe1808F9",
    privateKeyToAccount(<Hex>appModeratorPrivateKey)
  );
  return resp.toString();
}
void registerApp().then((res) => console.log("registerApp:", res));

import * as process from "node:process";

import * as dotenv from "dotenv";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { b3Sepolia } from "viem/chains";

import { AppRegistry } from "../../appRegistry";
import {
  B3SepoliaAppRegistryContractAddress,
  B3SepoliaPointIndexerURL,
} from "../../constants";

dotenv.config(); // Load environment variables from .env file

const appOperatorPrivateKey =
  `0x${process.env.OPERATOR_PRIVATE_KEY}` || `{0x}`;

export async function registerApp(): Promise<string> {
  const registry = new AppRegistry(
    B3SepoliaPointIndexerURL,
    B3SepoliaAppRegistryContractAddress,
    b3Sepolia,
  );
  registry.connect();
  const resp = await registry.register(
    "b3.b3.fun",
    "0xB90d8162a3A1a2d760699F1f08c5F0cdAe1808F9",
    privateKeyToAccount(<Hex>appOperatorPrivateKey),
  );
  return resp.toString();
}
void registerApp().then((res) => console.log("registerApp:", res));

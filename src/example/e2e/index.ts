import process from "node:process";

import * as dotenv from "dotenv";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { b3Sepolia } from "viem/chains";

import { AppRegistry } from "../../appRegistry";
import { BPS } from "../../bps";
import {
  B3SepoliaAppRegistryContractAddress,
  B3SepoliaPointIndexerURL,
  B3SepoliaPointServiceContractAddress,
} from "../../constants";

dotenv.config(); // Load environment variables from .env file

const appOperatorPrivateKey =
  `0x${process.env.OPERATOR_PRIVATE_KEY}` || `{0x}`;

const registry = new AppRegistry(
  B3SepoliaPointIndexerURL,
  B3SepoliaAppRegistryContractAddress,
  b3Sepolia,
);
const bps = new BPS(
  B3SepoliaPointIndexerURL,
  B3SepoliaPointServiceContractAddress,
  b3Sepolia,
);

async function main(): Promise<void> {
  registry.connect();
  bps.connect();

  // register an app
  let resp = await registry.register(
    "test.b3.fun",
    privateKeyToAccount(<Hex>appOperatorPrivateKey).address,
    privateKeyToAccount(<Hex>appOperatorPrivateKey),
  );
  console.log("register-app:", resp);

  await sleep(10000); // wait till the event get registered on indexer

  // list apps - should print the newly created app
  const apps = await registry.listApps({
    pageNumber: 1,
    pageSize: 1,
    rankings: { attribute: "createdAt", direction: "DESC" },
  });
  console.log("list-apps:", apps);


  // grant points
  resp = await bps.transferPoints(
    BigInt(apps.results.length > 0 ? apps.results[0].appId : 3n),
    [
      {
        recipient: privateKeyToAccount(<Hex>appOperatorPrivateKey).address, // replace
        point: 20n,
      },
    ],
    privateKeyToAccount(<Hex>appOperatorPrivateKey),
  );
  console.log("transfer-points:", resp);

  await sleep(10000); // wait till the event get registered on indexer

  const appPoints = await bps.getAppTotalPoints({
    appId: BigInt(apps.results.length > 0 ? apps.results[0].appId : 3n),
  });
  console.log("appPoints:", appPoints);

  const userPoints = await bps.getUserTotalPoints({
    account: privateKeyToAccount(<Hex>appOperatorPrivateKey).address,
  });
  console.log("userPoints:", userPoints);
}

void main();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

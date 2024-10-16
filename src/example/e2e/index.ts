import process from "node:process";

import * as dotenv from "dotenv";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { AppRegistry } from "../../appRegistry";
import { BPS } from "../../bps";
import { b3SepoliaConfig } from "../../config";

dotenv.config(); // Load environment variables from .env file

const appModeratorPrivateKey =
  `0x${process.env.MODERATOR_PRIVATE_KEY}` || `{0x}`;
const b3AdminPrivateKey = `0x${process.env.B3_ADMIN_PRIVATE_KEY}` || `{0x}`;

const chainConfig = b3SepoliaConfig;
const registry = new AppRegistry(
  chainConfig.indexerUrl,
  chainConfig.appRegistryContractAddress,
  chainConfig.chain
);
const bps = new BPS(
  chainConfig.indexerUrl,
  chainConfig.pointServiceContractAddress,
  chainConfig.chain
);

async function main(): Promise<void> {
  registry.connect();
  bps.connect();

  // register an app
  let resp = await registry.register(
    "test.b3.fun",
    privateKeyToAccount(<Hex>appModeratorPrivateKey).address,
    privateKeyToAccount(<Hex>appModeratorPrivateKey)
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
  resp = await bps.grantPoints(
    [
      {
        appId: BigInt(apps.results.length > 0 ? apps.results[0].appId : 3n),
        point: 20n,
      },
    ],
    privateKeyToAccount(<Hex>b3AdminPrivateKey)
  );
  console.log("grant-points:", resp);

  // grant points
  resp = await bps.transferPoints(
    BigInt(apps.results.length > 0 ? apps.results[0].appId : 3n),
    [
      {
        recipient: privateKeyToAccount(<Hex>appModeratorPrivateKey).address, // replace
        point: 20n,
      },
    ],
    privateKeyToAccount(<Hex>appModeratorPrivateKey)
  );
  console.log("transfer-points:", resp);

  await sleep(10000); // wait till the event get registered on indexer

  const appPoints = await bps.getAppTotalPoints({
    appId: BigInt(apps.results.length > 0 ? apps.results[0].appId : 3n),
  });
  console.log("appPoints:", appPoints);

  const userPoints = await bps.getUserTotalPoints({
    account: privateKeyToAccount(<Hex>appModeratorPrivateKey).address,
  });
  console.log("userPoints:", userPoints);
}

void main();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

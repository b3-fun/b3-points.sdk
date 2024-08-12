import process from "node:process";

import * as dotenv from "dotenv";
import type { AppPoints, ListQueryResponse, UserPoints } from "types";
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

import { BPS } from "../bps";
import {
  B3PointIndexerURLOnB3Sepolia,
  B3SepoliaPointServiceContractAddress,
} from "../constants";

dotenv.config(); // Load environment variables from .env file

const b3AdminPrivateKey = `0x${process.env.B3_ADMIN_PRIVATE_KEY}` || `0x`;
const appModeratorPrivateKey =
  `0x${process.env.B3_ADMIN_PRIVATE_KEY}` || `{0x}`;

export async function grantPoints(): Promise<string> {
  const bps = new BPS(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaPointServiceContractAddress,
    mainnet,
  );
  bps.connect();
  const response = await bps.grantPoints(
    [
      {
        appId: 3n,
        point: 20n,
      },
    ],
    privateKeyToAccount(<Hex>b3AdminPrivateKey),
  );
  return response.toString();
}

export async function transferPoints(): Promise<string> {
  const bps = new BPS(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaPointServiceContractAddress,
    mainnet,
  );
  bps.connect();
  const response = await bps.transferPoints(
    3n,
    [
      {
        recipient: "0xB90d8162a3A1a2d760699F1f08c5F0cdAe1808F9",
        point: 10n,
      },
    ],
    privateKeyToAccount(<Hex>appModeratorPrivateKey),
  );
  return response.toString();
}

export async function cancelTransfer(): Promise<string> {
  const bps = new BPS(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaPointServiceContractAddress,
    mainnet,
  );
  bps.connect();
  const response = await bps.cancelTransfer(
    "0x123456", // replace with existing transfer uid
    privateKeyToAccount(<Hex>appModeratorPrivateKey),
  );
  return response.toString();
}

export async function advanceSession(): Promise<string> {
  const bps = new BPS(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaPointServiceContractAddress,
    mainnet,
  );
  bps.connect();
  const response = await bps.advanceSession(
    privateKeyToAccount(<Hex>b3AdminPrivateKey),
  );
  return response.toString();
}

export async function getAppTotalPoints(): Promise<string> {
  const bps = new BPS(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaPointServiceContractAddress,
    mainnet,
  );

  const response = await bps.getAppTotalPoints({
    appId: 3n,
    session: 1n,
  });
  return response.points;
}

export async function getAppAvailablePoints(): Promise<string> {
  const bps = new BPS(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaPointServiceContractAddress,
    mainnet,
  );

  const response = await bps.getAppAvailablePoints({
    appId: 3n,
    session: 1n,
  });
  return response.points;
}

export async function aggregateAppPoints(): Promise<
  ListQueryResponse<AppPoints>
> {
  const bps = new BPS(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaPointServiceContractAddress,
    mainnet,
  );

  return await bps.aggregateAppPoints({
    session: 1n,
    rankings: { direction: "ASC", attribute: "points" },
    pageNumber: 1,
    pageSize: 10,
  });
}

export async function getUserTotalPoints(): Promise<string> {
  const bps = new BPS(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaPointServiceContractAddress,
    mainnet,
  );

  const response = await bps.getUserTotalPoints({
    account: "0x51326086f9648740BA26C7D4190c41Ef2bA94399",
  });
  return response.points;
}

export async function aggregateUserPoints(): Promise<
  ListQueryResponse<UserPoints>
> {
  const bps = new BPS(
    B3PointIndexerURLOnB3Sepolia,
    B3SepoliaPointServiceContractAddress,
    mainnet,
  );

  return await bps.aggregateUserPoints({
    appId: 3n,
    session: 1n,
    rankings: { direction: "DESC", attribute: "points" },
    pageNumber: 1,
    pageSize: 10,
  });
}

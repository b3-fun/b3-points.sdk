import type {AppPoints, ListQueryResponse} from "types";
import { mainnet } from "viem/chains";

import { BPS } from "../../bps";
import {
  B3PointIndexerURLOnB3Sepolia,
  B3SepoliaPointServiceContractAddress,
} from "../../constants";

async function getTotalAppPoints(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointServiceContractAddress,
    B3PointIndexerURLOnB3Sepolia,
    mainnet,
  );

  const response = await bps.getTotalAppPoints({
    appId: 3n,
    session: 1n,
  });
  return response.points;
}

async function getAppAvailabePoints(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointServiceContractAddress,
    B3PointIndexerURLOnB3Sepolia,
    mainnet,
  );

  const response = await bps.getAppAvailablePoints({
    appId: 3n,
    session: 1n,
  });
  return response.points;
}

async function aggregateAppPoints(): Promise<ListQueryResponse<AppPoints>> {
  const bps = new BPS(
    B3SepoliaPointServiceContractAddress,
    B3PointIndexerURLOnB3Sepolia,
    mainnet,
  );

  return await bps.aggregateAppPoints({
    session: 1n,
    rankings: { direction: "ASC", attribute: "points" },
    pageNumber: 1,
    pageSize: 10,
  });
}

void getTotalAppPoints().then((r) => console.log("getAppPoints:", r));
void getAppAvailabePoints().then((r) => console.log("getAppAvailablePoints:", r));
void aggregateAppPoints().then((r) => console.log("aggregateAppPoints", r));

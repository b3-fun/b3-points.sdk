import type { AppPoints, ListQueryResponse } from "types";
import { b3Sepolia } from "viem/chains";

import { BPS } from "../../bps";
import {
  B3SepoliaPointIndexerURL,
  B3SepoliaPointServiceContractAddress,
} from "../../constants";

export async function getAppTotalPoints(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointIndexerURL,
    B3SepoliaPointServiceContractAddress,
    b3Sepolia,
  );

  const response = await bps.getAppTotalPoints({
    appId: 3n,
    session: 1n,
  });
  return response.points;
}

export async function getAppAvailablePoints(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointIndexerURL,
    B3SepoliaPointServiceContractAddress,
    b3Sepolia,
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
    B3SepoliaPointIndexerURL,
    B3SepoliaPointServiceContractAddress,
    b3Sepolia,
  );

  return await bps.aggregateAppPoints({
    session: 1n,
    rankings: { direction: "ASC", attribute: "points" },
    pageNumber: 1,
    pageSize: 10,
  });
}

void getAppTotalPoints().then((r) => console.log("getAppTotalPoints:", r));
void getAppAvailablePoints().then((r) =>
  console.log("getAppAvailablePoints:", r),
);
void aggregateAppPoints().then((r) => console.log("aggregateAppPoints", r));

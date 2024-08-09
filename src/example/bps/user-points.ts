import type { ListQueryResponse, UserPoints } from "types";
import { mainnet } from "viem/chains";

import { BPS } from "../../bps";
import { B3PointIndexerURLOnB3Sepolia, B3SepoliaPointServiceContractAddress } from "../../constants";

async function getUserPoints(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointServiceContractAddress,
    B3PointIndexerURLOnB3Sepolia,
    mainnet,
  );

  const response = await bps.getUserPoints({
    account: "0x51326086f9648740BA26C7D4190c41Ef2bA94399",
  });
  return response.points;
}

async function aggregateUserPoints(): Promise<ListQueryResponse<UserPoints>> {
  const bps = new BPS(
    B3SepoliaPointServiceContractAddress,
    B3PointIndexerURLOnB3Sepolia,
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

void getUserPoints().then((r) => console.log("getUserPoints:", r));
void aggregateUserPoints().then((r) => console.log("aggregateUserPoints", r));

import type { ListQueryResponse, UserPoints } from "types";

import { BPS } from "../../bps";
import { b3SepoliaConfig } from "../../config";

const chainConfig = b3SepoliaConfig;
export async function getUserTotalPoints(): Promise<string> {
  const bps = new BPS(
    chainConfig.indexerUrl,
    chainConfig.pointServiceContractAddress,
    chainConfig.chain
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
    chainConfig.indexerUrl,
    chainConfig.pointServiceContractAddress,
    chainConfig.chain
  );

  return await bps.aggregateUserPoints({
    appId: 3n,
    session: 1n,
    rankings: { direction: "DESC", attribute: "points" },
    pageNumber: 1,
    pageSize: 10,
  });
}

void getUserTotalPoints().then((r) => console.log("getUserTotalPoints:", r));
void aggregateUserPoints().then((r) => console.log("aggregateUserPoints:", r));

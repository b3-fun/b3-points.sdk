import { b3Sepolia } from "viem/chains";
import type { ListQueryResponse, PointTransfer } from "../../types";

import { BPS } from "../../bps";
import {
  B3SepoliaPointIndexerURL,
  B3SepoliaPointServiceContractAddress,
} from "../../constants";

export async function listPointTransfers(): Promise<
  ListQueryResponse<PointTransfer>
> {
  const bps = new BPS(
    B3SepoliaPointIndexerURL,
    B3SepoliaPointServiceContractAddress,
    b3Sepolia
  );

  return await bps.listPointTransfers({
    appId: 3n,
    pageSize: 10,
    pageNumber: 1,
  });
}

void listPointTransfers().then((r) => console.log("listPointTransfers:", r));

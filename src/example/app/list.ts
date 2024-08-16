import type { App, ListQueryResponse } from "types";
import { b3Sepolia } from "viem/chains";

import { AppRegistry } from "../../appRegistry";
import {
  B3SepoliaAppRegistryContractAddress,
  B3SepoliaPointIndexerURL,
} from "../../constants";

export async function listApps(): Promise<ListQueryResponse<App>> {
  const registry = new AppRegistry(
    B3SepoliaPointIndexerURL,
    B3SepoliaAppRegistryContractAddress,
    b3Sepolia,
  );

  return await registry.listApps({
    rankings: { direction: "DESC", attribute: "createdAt" },
    pageNumber: 1,
    pageSize: 10,
  });
}

void listApps().then((r) => {
  console.log("listApps: ", r);
});

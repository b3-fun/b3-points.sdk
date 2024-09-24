import type { Session } from "types";
import { b3Sepolia } from "viem/chains";

import { BPS } from "../../bps";
import {
  B3SepoliaPointIndexerURL,
  B3SepoliaPointServiceContractAddress,
} from "../../constants";

export async function listSessions(): Promise<{ data: Session[] }> {
  const bps = new BPS(
    B3SepoliaPointIndexerURL,
    B3SepoliaPointServiceContractAddress,
    b3Sepolia,
  );
  return await bps.listSessions();
}

void listSessions().then((r) => console.log("listSessions:", r));

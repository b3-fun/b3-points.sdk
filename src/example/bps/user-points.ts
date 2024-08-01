import { mainnet } from "viem/chains";

import { BPS } from "../../bps";
import {
  B3PointIndexerURLOnB3Sepolia,
  B3SepoliaPointServiceContractAddress,
} from "../../constants";

async function fetchUserPoints(): Promise<string> {
  const bps = new BPS(
    B3SepoliaPointServiceContractAddress,
    B3PointIndexerURLOnB3Sepolia,
    mainnet,
  );

  const response = await bps.getUserPoints(
    "0x51326086f9648740BA26C7D4190c41Ef2bA94399",
  );
  return response.points;
}

void fetchUserPoints().then((r) => console.log(r));

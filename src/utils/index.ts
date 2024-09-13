// https://npmjs.com/package/dns-packet
import type { Chain, Hex } from "viem";
import { parseAbi, encodeFunctionData } from "viem";
import { b3Sepolia } from "viem/chains";
import { namehash } from "viem/ens";

import {
  SepoliaCCIPGatewayBaseUrl,
  SepoliaENSResolverAddress,
  MainnetCCIPGatewayBaseUrl,
  MainnetENSResolverAddress,
} from "../constants";

/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-require-imports */
/* eslint-disable  @typescript-eslint/no-var-requires */
const dnsPacket = require("dns-packet");

const IAddrResolverABI = parseAbi([
  "function addr(bytes32 node) external view returns (address payable)",
]);

const OffchainResolverABI = parseAbi([
  "function resolve(bytes calldata name, bytes calldata data) external view returns (bytes memory)",
]);

export const lookupENSName = async (
  name: string,
  chain: Chain,
): Promise<Hex> => {
  // Encode app ENS name to get dns name and node
  /* eslint-disable  @typescript-eslint/no-unsafe-call */
  /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
  const dnsName: `0x${string}` = `0x${dnsPacket.name.encode(name).toString("hex")}`;
  const ensNode = namehash(name);

  // Construct `resolve` request to the CCIP gateway lookup call
  const data = encodeFunctionData({
    abi: IAddrResolverABI,
    functionName: "addr",
    args: [ensNode],
  });
  const calldata = encodeFunctionData({
    abi: OffchainResolverABI,
    functionName: "resolve",
    args: [dnsName, data],
  });

  // Call CCIP gateway to lookup the ens name
  let gatewayLookupURL;
  if (chain.id === b3Sepolia.id) {
    gatewayLookupURL = `${SepoliaCCIPGatewayBaseUrl}/${SepoliaENSResolverAddress}/${calldata}.json`;
  } else {
    gatewayLookupURL = `${MainnetCCIPGatewayBaseUrl}/${MainnetENSResolverAddress}/${calldata}.json`;
  }

  const resp = await fetch(gatewayLookupURL);
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }
  const respBody = await resp.json();
  /* eslint-disable  @typescript-eslint/no-unsafe-return */
  return respBody.data;
};

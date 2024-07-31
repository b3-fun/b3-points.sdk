// https://npmjs.com/package/dns-packet
import { parseAbi, encodeFunctionData } from "viem";
import { namehash } from "viem/ens";

import {
  SepoliaCCIPGatewayBaseUrl,
  SepoliaENSResolverAddress,
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

export const lookupENSName = async (name: string): Promise<`0x${string}`> => {
  console.log("Lookup ENS name: ", name);
  // Encode app ENS name to get dns name and node
  /* eslint-disable  @typescript-eslint/no-unsafe-call */
  /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
  const dnsName: `0x${string}` = `0x${dnsPacket.name.encode(name).toString("hex")}`;
  const ensNode = namehash(name);
  console.log("dnsName", dnsName);
  console.log("node", ensNode);

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
  console.log("data", data);
  console.log("calldata", calldata);

  // Call CCIP gateway to lookup the ens name
  const resp = await fetch(
    `${SepoliaCCIPGatewayBaseUrl}/${SepoliaENSResolverAddress}/${calldata}.json`,
  );
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }
  const respBody = await resp.json();
  /* eslint-disable  @typescript-eslint/no-unsafe-return */
  return respBody.data;
};

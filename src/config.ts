import type { Address } from "viem";
import type { Chain } from "viem/chains";
import { b3, b3Sepolia } from "viem/chains";
import {
  B3MainnetAppRegistryContractAddress,
  B3MainnetPointIndexerURL,
  B3MainnetPointServiceContractAddress,
  B3SepoliaAppRegistryContractAddress,
  B3SepoliaPointIndexerURL,
  B3SepoliaPointServiceContractAddress,
  MainnetCCIPGatewayBaseUrl,
  MainnetENSResolverAddress,
  SepoliaCCIPGatewayBaseUrl,
  SepoliaENSResolverAddress,
} from "./constants";

export interface Config {
  indexerUrl: string;
  pointServiceContractAddress: Address;
  chain: Chain;
  appRegistryContractAddress: Address;
  ccipGatewayBaseUrl: string;
  ensResolverAddress: Address;
}

export const b3SepoliaConfig: Config = {
  indexerUrl: B3SepoliaPointIndexerURL,
  pointServiceContractAddress: B3SepoliaPointServiceContractAddress,
  chain: b3Sepolia,
  appRegistryContractAddress: B3SepoliaAppRegistryContractAddress,
  ccipGatewayBaseUrl: SepoliaCCIPGatewayBaseUrl,
  ensResolverAddress: SepoliaENSResolverAddress,
};

export const b3MainnetConfig: Config = {
  indexerUrl: B3MainnetPointIndexerURL,
  pointServiceContractAddress: B3MainnetPointServiceContractAddress,
  chain: b3,
  appRegistryContractAddress: B3MainnetAppRegistryContractAddress,
  ccipGatewayBaseUrl: MainnetCCIPGatewayBaseUrl,
  ensResolverAddress: MainnetENSResolverAddress,
};

import type {
  Chain,
  EIP1193Provider,
  GetContractReturnType,
  Hex,
  WalletClient,
  WriteContractReturnType,
} from "viem";
import { createWalletClient, custom, getContract } from "viem";

import { B3SepoliaAppRegistryContractAddress } from "./constants";
import { AppRegistryABI } from "./contracts/AppRegistryABI";
import { lookupENSName } from "./utils";

export class AppRegistry {
  private appRegistryContract: GetContractReturnType<
    typeof AppRegistryABI,
    WalletClient
  >;
  private chain: Chain;

  constructor(provider: EIP1193Provider, chain: Chain) {
    this.chain = chain;

    const client = createWalletClient({
      chain: chain,
      transport: custom(provider),
    });

    this.appRegistryContract = getContract({
      address: B3SepoliaAppRegistryContractAddress,
      abi: AppRegistryABI,
      client,
    });
  }

  public async register(
    appName: `0x${string}`,
    operator: `0x${string}`,
    gatewayName: string,
    account: Hex,
  ): Promise<WriteContractReturnType> {
    const ccipGatewayResp = await lookupENSName(gatewayName);

    return await this.appRegistryContract.write.register(
      [appName, operator, ccipGatewayResp],
      { account, chain: this.chain },
    );
  }
}

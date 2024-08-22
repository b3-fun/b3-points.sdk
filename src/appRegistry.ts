import type { App, ListAppsOptions, ListQueryResponse } from "types";
import type {
  Address,
  Chain,
  EIP1193Provider,
  GetContractReturnType,
  Hex,
  PrivateKeyAccount,
  WalletClient,
  WriteContractReturnType,
} from "viem";
import { http, custom, createWalletClient, getContract } from "viem";

import { AppRegistryABI } from "./contracts/AppRegistryABI";
import { fetchQuery } from "./services/indexer/fetcher";
import { listAppsQuery } from "./services/indexer/queries/appRegistry/app";
import type { QueryResponse } from "./services/indexer/types";
import { lookupENSName } from "./utils";

export class AppRegistry {
  private appRegistryContract: GetContractReturnType<
    typeof AppRegistryABI,
    WalletClient
  >;
  private appRegistryContractAddress: Hex;
  private chain: Chain;
  private indexerEndpoint: string;

  constructor(indexerURL: string, address: Hex, chain: Chain) {
    this.appRegistryContractAddress = address;
    this.chain = chain;
    this.indexerEndpoint = indexerURL;
  }

  // Method overloads
  public connect(): void; // Default provider
  public connect(provider: EIP1193Provider): void; // Custom provider

  // Implementation of the connect method
  public connect(provider?: EIP1193Provider): void {
    const client = createWalletClient({
      chain: this.chain,
      transport: provider ? custom(provider) : http(), // Use custom transport if provider is provided
    });

    this.appRegistryContract = getContract({
      address: this.appRegistryContractAddress,
      abi: AppRegistryABI,
      client,
    });
  }

  public async register(
    appName: string,
    operator: `0x${string}`,
    account: PrivateKeyAccount | Address,
  ): Promise<WriteContractReturnType> {
    const ccipGatewayResp = await lookupENSName(appName, this.chain);

    return await this.appRegistryContract.write.register(
      [appName, operator, ccipGatewayResp],
      { account, chain: this.chain },
    );
  }

  public async listApps(
    options: ListAppsOptions,
  ): Promise<ListQueryResponse<App>> {
    const response = await fetchQuery<QueryResponse<ListQueryResponse<App>>>(
      this.indexerEndpoint,
      listAppsQuery,
      {
        operator: options.operator?.toString(),
        pageNumber: options.pageNumber,
        pageSize: options.pageSize,
        rankings: options.rankings,
      },
    );
    return response.data.data;
  }
}

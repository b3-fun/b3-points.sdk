import type {
  AggregateAppPointsOptions,
  AggregateUserPointsOptions,
  AppPoints,
  AppPointsOptions,
  GrantRequest,
  ListQueryResponse,
  TransferRequest,
  UserPoints,
  UserPointsOptions,
} from "types";
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
import { http, createWalletClient, custom, getContract } from "viem";

import { BPSContractABI } from "./contracts/BPS_ABI";
import { fetchQuery } from "./services/indexer/fetcher";
import {
  aggregateAppPointGrantQuery,
  getAppAvailablePointsQuery,
} from "./services/indexer/queries/bps/point-grant";
import { aggregateUserPointQuery } from "./services/indexer/queries/bps/point-transfer";
import type { QueryResponse } from "./services/indexer/types";

export class BPS {
  private bpsContractAddress: Hex;
  private bpsContract: GetContractReturnType<
    typeof BPSContractABI,
    WalletClient
  >;
  private chain: Chain;
  private indexerEndpoint: string;

  constructor(indexerURL: string, address: Hex, chain: Chain) {
    this.bpsContractAddress = address;
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

    this.bpsContract = getContract({
      address: this.bpsContractAddress,
      abi: BPSContractABI,
      client,
    });
  }

  public async grantPoints(
    requests: readonly GrantRequest[],
    account: PrivateKeyAccount | Address,
  ): Promise<WriteContractReturnType> {
    return await this.bpsContract.write.grantPoints([requests], {
      account,
      chain: this.chain,
    });
  }

  public async transferPoints(
    appId: bigint,
    requests: readonly TransferRequest[],
    account: PrivateKeyAccount | Address,
  ): Promise<WriteContractReturnType> {
    return await this.bpsContract.write.transferPoints([appId, requests], {
      account,
      chain: this.chain,
    });
  }

  public async cancelTransfer(
    uid: Hex,
    account: PrivateKeyAccount | Address,
  ): Promise<WriteContractReturnType> {
    return await this.bpsContract.write.cancelTransfer([uid], {
      account,
      chain: this.chain,
    });
  }

  public async advanceSession(
    account: PrivateKeyAccount | Address,
  ): Promise<WriteContractReturnType> {
    return await this.bpsContract.write.advanceSession({
      account,
      chain: this.chain,
    });
  }

  public async getAppTotalPoints(
    options: AppPointsOptions,
  ): Promise<AppPoints> {
    const response = await fetchQuery<
      QueryResponse<ListQueryResponse<AppPoints>>
    >(this.indexerEndpoint, aggregateAppPointGrantQuery, {
      appId: options.appId.toString(),
      session: options.session?.toString(),
    });
    return (
      response.data.data.results[0] || {
        appId: options.appId.toString(),
        points: 0,
      }
    );
  }

  public async getAppAvailablePoints(
    options: AppPointsOptions,
  ): Promise<AppPoints> {
    const response = await fetchQuery<QueryResponse<AppPoints>>(
      this.indexerEndpoint,
      getAppAvailablePointsQuery,
      {
        appId: options.appId.toString(),
        session: options.session?.toString(),
      },
    );
    return (
      response.data.data || {
        appId: options.appId.toString(),
        points: 0,
      }
    );
  }

  public async aggregateAppPoints(
    options: AggregateAppPointsOptions,
  ): Promise<ListQueryResponse<AppPoints>> {
    const response = await fetchQuery<
      QueryResponse<ListQueryResponse<AppPoints>>
    >(this.indexerEndpoint, aggregateAppPointGrantQuery, {
      session: options.session?.toString(),
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      rankings: options.rankings,
    });
    return response.data.data;
  }

  public async getUserTotalPoints(
    options: UserPointsOptions,
  ): Promise<UserPoints> {
    const response = await fetchQuery<
      QueryResponse<ListQueryResponse<UserPoints>>
    >(this.indexerEndpoint, aggregateUserPointQuery, {
      appId: options.appId?.toString(),
      user: options.account.toString(),
      session: options.session?.toString(),
    });
    return (
      response.data.data.results[0] || {
        user: options.account.toString(),
        points: 0,
      }
    );
  }

  public async aggregateUserPoints(
    options: AggregateUserPointsOptions,
  ): Promise<ListQueryResponse<UserPoints>> {
    const response = await fetchQuery<
      QueryResponse<ListQueryResponse<UserPoints>>
    >(this.indexerEndpoint, aggregateUserPointQuery, {
      appId: options.appId?.toString(),
      session: options.session?.toString(),
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      rankings: options.rankings,
    });
    return response.data.data;
  }
}

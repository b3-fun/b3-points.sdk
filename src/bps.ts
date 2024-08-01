import type { GrantRequest, TransferRequest, UserPoints } from "types";
import type {
  Chain,
  EIP1193Provider,
  GetContractReturnType,
  Hex,
  ReadContractReturnType,
  WalletClient,
  WriteContractReturnType,
} from "viem";
import { createWalletClient, custom, getContract } from "viem";

import { BPSContractABI } from "./contracts/BPS_ABI";
import { fetchQuery } from "./services/indexer/fetcher";
import { aggregateUserPointQuery } from "./services/indexer/queries/bps/point-transfer";
import type {
  ListQueryResponse,
  QueryResponse,
} from "./services/indexer/types";

export class BPS {
  private bpsContractAddress: Hex;
  private bpsContract: GetContractReturnType<
    typeof BPSContractABI,
    WalletClient
  >;
  private chain: Chain;
  private indexerEndpoint: string;

  constructor(address: Hex, indexerURL: string, chain: Chain) {
    this.bpsContractAddress = address;
    this.chain = chain;
    this.indexerEndpoint = indexerURL;
  }

  public connect(provider: EIP1193Provider): void {
    const client = createWalletClient({
      chain: this.chain,
      transport: custom(provider),
    });

    this.bpsContract = getContract({
      address: this.bpsContractAddress,
      abi: BPSContractABI,
      client,
    });
  }

  public async grantPoints(
    requests: readonly GrantRequest[],
    account: Hex,
  ): Promise<WriteContractReturnType> {
    return await this.bpsContract.write.grantPoints([requests], {
      account,
      chain: this.chain,
    });
  }

  public async transferPoints(
    appId: bigint,
    requests: readonly TransferRequest[],
    account: Hex,
  ): Promise<WriteContractReturnType> {
    return await this.bpsContract.write.transferPoints([appId, requests], {
      account,
      chain: this.chain,
    });
  }

  public async cancelTransfer(
    uid: `0x${string}`,
    account: Hex,
  ): Promise<WriteContractReturnType> {
    return await this.bpsContract.write.cancelTransfer([uid], {
      account,
      chain: this.chain,
    });
  }

  public async getAppTotalPoints(
    session: bigint,
    appId: bigint,
  ): Promise<ReadContractReturnType> {
    return await this.bpsContract.read.getTotalPoint([session, appId]);
  }

  public async getAppAvailablePoints(
    session: bigint,
    appId: bigint,
  ): Promise<ReadContractReturnType> {
    return await this.bpsContract.read.getAvailablePoint([session, appId]);
  }

  public async getUserPoints(
    account: Hex,
    appId?: bigint,
    session?: bigint,
  ): Promise<UserPoints> {
    const response = await fetchQuery<
      QueryResponse<ListQueryResponse<UserPoints>>
    >(this.indexerEndpoint, aggregateUserPointQuery, {
      appId: appId?.toString(),
      user: account.toString(),
      session: session?.toString(),
    });
    return response.data.data.results[0] || { points: 0 };
  }
}

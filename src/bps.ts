import {Contract, ContractInterface, providers, Signer} from "ethers";
import { getUserPointsGraphCall } from "./services/indexer";

type Requests = {recipient: string, points: number}[]

export class BPS {
  private bpsContractAddress: string
  private bpsContract: Contract
  private bpsContractABI: ContractInterface

  constructor(address: string) {
    this.bpsContractAddress = address;
  }

  public connect(provider: providers.BaseProvider) {
    this.bpsContract = new Contract(this.bpsContractAddress, this.bpsContractABI, provider);
  }

  public async grantPoints(requests: Requests, signer: Signer) {
    return await this.bpsContract.grantPoints(requests, signer)
  }

  public async transferPoints(appId: number, requests: Requests, signer: Signer) {
    return await this.bpsContract.grantPoints(appId, requests, signer)
  }

  public async cancelTransfer() {
    return await this.bpsContract.cancelTransfer()
  }

  public async getAppTotalPoints() {
    return await this.bpsContract.getAppTotalPoints()
  }

  public async getAppAvailablePoints() {
    return await this.bpsContract.getAppAvailablePoints()
  }

  public async getUserPoints() {
    return getUserPointsGraphCall()
  }
}
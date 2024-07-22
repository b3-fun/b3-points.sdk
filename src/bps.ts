import {Contract} from "ethers";
import { getUserPointsGraphCall } from "./services/indexer";
import { GrantRequest, TransferRequest } from "./types";
import { BPSContractABI } from "./contracts/BPS_ABI";
import { ContractRunner } from "ethers";

export class BPS {
  private bpsContractAddress: string
  private bpsContract: Contract

  constructor(address: string) {
    this.bpsContractAddress = address;
  }

  public connect(runner: ContractRunner) {
    this.bpsContract = new Contract(this.bpsContractAddress, BPSContractABI, runner);
  }

  public async grantPoints(requests: GrantRequest[]) {
    return await this.bpsContract.grantPoints(requests)
  }

  public async transferPoints(appId: number, requests: TransferRequest[]) {
    return await this.bpsContract.transferPoints(appId, requests)
  }

  public async cancelTransfer(uid: number) {
    return await this.bpsContract.cancelTransfer(uid)
  }

  public async getAppTotalPoints(session: number, appId: number) {
    return await this.bpsContract.getTotalPoint(session, appId)
  }

  public async getAppAvailablePoints(session: number, appId: number) {
    return await this.bpsContract.getAvailablePoint(session, appId)
  }

  public async getUserPoints() {
    return getUserPointsGraphCall()
  }
}
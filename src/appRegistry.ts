import { Contract, ContractRunner } from "ethers";
import { getGatewayResponse } from "./utils";
import { AppRegistryABI } from "./contracts/AppRegistryABI";

export class AppRegistry {
  private appRegistryContractAddress: string
  private appRegistryContract: Contract

  constructor(runner: ContractRunner) {
    this.appRegistryContract = new Contract(this.appRegistryContractAddress, AppRegistryABI, runner)
  }


  public async grantPoints(appName: string, operator: string, gatewayName: string) {

    const gatewayResponse = await getGatewayResponse(gatewayName);

    return await this.appRegistryContract.register({
      appName,
      operator,
      gatewayResponse
      })
  }
}

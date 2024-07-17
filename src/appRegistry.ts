import { Contract, ContractInterface, providers } from "ethers";
import { getGatewayResponse } from "./utils";

export class AppRegistry {
  private appRegistryContractAddress: string
  private appRegistryContract: Contract
  private appRegistryContractABI: ContractInterface

  constructor(provider: providers.BaseProvider) {
    this.appRegistryContract = new Contract(this.appRegistryContractAddress, this.appRegistryContractABI, provider)
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

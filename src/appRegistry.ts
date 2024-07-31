import type { Signer } from "ethers";
import { Contract } from "ethers";

import { B3SepoliaAppRegistryContractAddress } from "./constants";
import { AppRegistryABI } from "./contracts/AppRegistryABI";
import { lookupENSName } from "./utils";

export class AppRegistry {
  private appRegistryContract: Contract;

  constructor(signer: Signer) {
    this.appRegistryContract = new Contract(
      B3SepoliaAppRegistryContractAddress,
      AppRegistryABI,
      signer,
    );
  }

  public async register(
    appName: string,
    operator: string,
    gatewayName: string,
  ): Promise<number> {
    const ccipGatewayResp = await lookupENSName(gatewayName);

    return await this.appRegistryContract.register({
      appName,
      operator,
      ccipGatewayResp,
    });
  }
}

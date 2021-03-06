import { ethers } from "hardhat";

import { ChainlinkOperator, ChainlinkOperator__factory } from "../../typechain";

async function main(): Promise<void> {
  const chainlinkOperatorFactory: ChainlinkOperator__factory = await ethers.getContractFactory("ChainlinkOperator");
  const chainlinkOperator: ChainlinkOperator = await chainlinkOperatorFactory.deploy();
  await chainlinkOperator.deployed();
  console.log("ChainlinkOperator deployed to: ", chainlinkOperator.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

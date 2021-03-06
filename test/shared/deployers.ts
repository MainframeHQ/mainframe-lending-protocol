import { Signer } from "@ethersproject/abstract-signer";
import { BigNumber } from "@ethersproject/bignumber";
import { artifacts, ethers, upgrades, waffle } from "hardhat";
import { Artifact } from "hardhat/types";

import {
  USDC_DECIMALS,
  USDC_NAME,
  USDC_SYMBOL,
  WBTC_DECIMALS,
  WBTC_NAME,
  WBTC_PRICE,
  WBTC_SYMBOL,
} from "../../helpers/constants";
import { getHTokenName, getHTokenSymbol } from "../../helpers/contracts";
import { getDeployContractOverrides } from "../../helpers/env";
import { price } from "../../helpers/numbers";
import {
  FintrollerV1__factory,
  GodModeBalanceSheet__factory,
  OwnableUpgradeable,
  OwnableUpgradeable__factory,
} from "../../typechain";
import { ChainlinkOperator } from "../../typechain/ChainlinkOperator";
import { FintrollerV1 } from "../../typechain/FintrollerV1";
import { GodModeBalanceSheet } from "../../typechain/GodModeBalanceSheet";
import { GodModeErc20 } from "../../typechain/GodModeErc20";
import { GodModeHToken } from "../../typechain/GodModeHToken";
import { HToken } from "../../typechain/HToken";
import { SimplePriceFeed } from "../../typechain/SimplePriceFeed";

const { deployContract } = waffle;
const overrides = getDeployContractOverrides();

export async function deployChainlinkOperator(deployer: Signer): Promise<ChainlinkOperator> {
  const chainlinkOperatorArtifact: Artifact = await artifacts.readArtifact("ChainlinkOperator");
  const chainlinkOperator: ChainlinkOperator = <ChainlinkOperator>(
    await deployContract(deployer, chainlinkOperatorArtifact, [], overrides)
  );
  return chainlinkOperator;
}

export async function deployFintrollerV1(): Promise<FintrollerV1> {
  const fintrollerV1Factory: FintrollerV1__factory = await ethers.getContractFactory("FintrollerV1");
  const fintrollerV1: FintrollerV1 = <FintrollerV1>await upgrades.deployProxy(fintrollerV1Factory);
  await fintrollerV1.deployed();
  return fintrollerV1;
}

export async function deployHToken(
  deployer: Signer,
  maturity: BigNumber,
  balanceSheetAddress: string,
  underlyingAddress: string,
): Promise<HToken> {
  const hTokenArtifact: Artifact = await artifacts.readArtifact("HToken");
  const hToken: HToken = <HToken>(
    await deployContract(
      deployer,
      hTokenArtifact,
      [getHTokenName(maturity), getHTokenSymbol(maturity), maturity, balanceSheetAddress, underlyingAddress],
      overrides,
    )
  );
  return hToken;
}

export async function deployGodModeBalanceSheet(
  fintrollerAddress: string,
  oracleAddress: string,
): Promise<GodModeBalanceSheet> {
  const godModeBalanceSheetFactory: GodModeBalanceSheet__factory = await ethers.getContractFactory(
    "GodModeBalanceSheet",
  );
  const balanceSheet: GodModeBalanceSheet = <GodModeBalanceSheet>(
    await upgrades.deployProxy(godModeBalanceSheetFactory, [fintrollerAddress, oracleAddress])
  );
  return balanceSheet;
}

export async function deployGodModeHToken(
  deployer: Signer,
  maturity: BigNumber,
  balanceSheetAddress: string,
  underlyingAddress: string,
): Promise<GodModeHToken> {
  const godModeHTokenArtifact: Artifact = await artifacts.readArtifact("GodModeHToken");
  const hToken: GodModeHToken = <GodModeHToken>(
    await deployContract(
      deployer,
      godModeHTokenArtifact,
      [getHTokenName(maturity), getHTokenSymbol(maturity), maturity, balanceSheetAddress, underlyingAddress],
      overrides,
    )
  );
  return hToken;
}

export async function deployOwnableUpgradeable(): Promise<OwnableUpgradeable> {
  const ownableUpgradeableFactory: OwnableUpgradeable__factory = await ethers.getContractFactory("OwnableUpgradeable");
  const ownableUpgradeable: OwnableUpgradeable = <OwnableUpgradeable>(
    await upgrades.deployProxy(ownableUpgradeableFactory)
  );
  await ownableUpgradeable.deployed();
  return ownableUpgradeable;
}

export async function deploySimplePriceFeed(
  deployer: Signer,
  description: string,
  price: BigNumber,
): Promise<SimplePriceFeed> {
  const simplePriceFeedArtifact: Artifact = await artifacts.readArtifact("SimplePriceFeed");
  const simplePriceFeed: SimplePriceFeed = <SimplePriceFeed>(
    await deployContract(deployer, simplePriceFeedArtifact, [description], overrides)
  );
  await simplePriceFeed.setPrice(price);
  return simplePriceFeed;
}

export async function deployUsdc(deployer: Signer): Promise<GodModeErc20> {
  const godModeErc20Artifact: Artifact = await artifacts.readArtifact("GodModeErc20");
  const usdc: GodModeErc20 = <GodModeErc20>(
    await deployContract(deployer, godModeErc20Artifact, [USDC_NAME, USDC_SYMBOL, USDC_DECIMALS], overrides)
  );
  return usdc;
}

export async function deployUsdcPriceFeed(deployer: Signer): Promise<SimplePriceFeed> {
  const simplePriceFeedArtifact: Artifact = await artifacts.readArtifact("SimplePriceFeed");
  const usdcPriceFeed: SimplePriceFeed = <SimplePriceFeed>(
    await deployContract(deployer, simplePriceFeedArtifact, ["USDC/USD"], overrides)
  );
  await usdcPriceFeed.setPrice(price("1"));
  return usdcPriceFeed;
}

export async function deployWbtc(deployer: Signer): Promise<GodModeErc20> {
  const godModeErc20Artifact: Artifact = await artifacts.readArtifact("GodModeErc20");
  const usdc: GodModeErc20 = <GodModeErc20>(
    await deployContract(deployer, godModeErc20Artifact, [WBTC_NAME, WBTC_SYMBOL, WBTC_DECIMALS], overrides)
  );
  return usdc;
}

export async function deployWbtcPriceFeed(deployer: Signer): Promise<SimplePriceFeed> {
  const simplePriceFeedArtifact: Artifact = await artifacts.readArtifact("SimplePriceFeed");
  const wbtcPriceFeed: SimplePriceFeed = <SimplePriceFeed>(
    await deployContract(deployer, simplePriceFeedArtifact, ["WBTC/USD"], overrides)
  );
  await wbtcPriceFeed.setPrice(WBTC_PRICE);
  return wbtcPriceFeed;
}

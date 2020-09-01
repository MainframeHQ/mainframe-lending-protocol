import { BigNumber } from "@ethersproject/bignumber";
import { Zero } from "@ethersproject/constants";
import { expect } from "chai";

import { FintrollerConstants, YTokenConstants } from "../../../helpers/constants";
import { FintrollerErrors } from "../../../helpers/errors";
import { OneHundredTokens, TenTokens } from "../../../helpers/constants";
import { YTokenErrors } from "../../../helpers/errors";
import { contextForTimeDependentTests } from "../../../helpers/mochaContexts";
import { increaseTime } from "../../../helpers/jsonRpcHelpers";

export default function shouldBehaveLikeMint(): void {
  describe("when the vault is open", function () {
    beforeEach(async function () {
      await this.contracts.yToken.connect(this.signers.brad).openVault();
    });

    describe("when the amount to mint is not zero", function () {
      describe("when the bond is listed", function () {
        beforeEach(async function () {
          await this.stubs.fintroller.mock.getBond
            .withArgs(this.contracts.yToken.address)
            .returns(FintrollerConstants.DefaultCollateralizationRatioMantissa);
        });

        describe("when the bond did not mature", function () {
          describe("when the fintroller allows new mints", function () {
            beforeEach(async function () {
              await this.stubs.fintroller.mock.mintAllowed.withArgs(this.contracts.yToken.address).returns(true);
            });

            /**
             * TODO: Write tests for the following cases:
             * - collateral value too small
             * - not enough liquidity in the guarantor pool
             */
            describe("when the caller deposited collateral", function () {
              beforeEach(async function () {
                await this.stubs.fintroller.mock.depositCollateralAllowed
                  .withArgs(this.contracts.yToken.address)
                  .returns(true);
                await this.stubs.collateral.mock.transferFrom
                  .withArgs(this.accounts.brad, this.contracts.yToken.address, TenTokens)
                  .returns(true);
                await this.contracts.yToken.connect(this.signers.brad).depositCollateral(TenTokens);
              });

              describe("when the caller locked the collateral", function () {
                beforeEach(async function () {
                  await this.contracts.yToken.connect(this.signers.brad).lockCollateral(TenTokens);
                });

                it("mints new yTokens", async function () {
                  const preBalance: BigNumber = await this.contracts.yToken.balanceOf(this.accounts.brad);
                  await this.contracts.yToken.connect(this.signers.brad).mint(OneHundredTokens);
                  const postBalance: BigNumber = await this.contracts.yToken.balanceOf(this.accounts.brad);
                  expect(preBalance).to.equal(postBalance.sub(OneHundredTokens));
                });

                it("emits a Mint event", async function () {
                  await expect(this.contracts.yToken.connect(this.signers.brad).mint(OneHundredTokens))
                    .to.emit(this.contracts.yToken, "Mint")
                    .withArgs(this.accounts.brad, OneHundredTokens);
                });

                it("emits a Transfer event", async function () {
                  await expect(this.contracts.yToken.connect(this.signers.brad).mint(OneHundredTokens))
                    .to.emit(this.contracts.yToken, "Transfer")
                    .withArgs(this.contracts.yToken.address, this.accounts.brad, OneHundredTokens);
                });
              });

              describe("when the caller did not lock the collateral", function () {
                it("reverts", async function () {
                  await expect(
                    this.contracts.yToken.connect(this.signers.brad).mint(OneHundredTokens),
                  ).to.be.revertedWith(YTokenErrors.BelowThresholdCollateralizationRatio);
                });
              });
            });

            describe("when the caller did not deposit any collateral", function () {
              it("reverts", async function () {
                await expect(
                  this.contracts.yToken.connect(this.signers.brad).mint(OneHundredTokens),
                ).to.be.revertedWith(YTokenErrors.BelowThresholdCollateralizationRatio);
              });
            });
          });

          describe("when the fintroller does not allow new mints", function () {
            beforeEach(async function () {
              await this.stubs.fintroller.mock.mintAllowed.withArgs(this.contracts.yToken.address).returns(false);
            });

            it("reverts", async function () {
              await expect(this.contracts.yToken.connect(this.signers.brad).mint(OneHundredTokens)).to.be.revertedWith(
                YTokenErrors.MintNotAllowed,
              );
            });
          });
        });

        contextForTimeDependentTests("when the bond matured", function () {
          beforeEach(async function () {
            await increaseTime(YTokenConstants.DefaultExpirationTime);
          });

          it("reverts", async function () {
            await expect(this.contracts.yToken.connect(this.signers.brad).mint(OneHundredTokens)).to.be.revertedWith(
              YTokenErrors.BondMatured,
            );
          });
        });
      });

      describe("when the bond is not listed", function () {
        beforeEach(async function () {
          await this.stubs.fintroller.mock.mintAllowed
            .withArgs(this.contracts.yToken.address)
            .revertsWithReason(FintrollerErrors.BondNotListed);
        });

        it("reverts", async function () {
          await expect(this.contracts.yToken.connect(this.signers.brad).mint(OneHundredTokens)).to.be.revertedWith(
            FintrollerErrors.BondNotListed,
          );
        });
      });
    });

    describe("when the amount to mint is zero", function () {
      it("reverts", async function () {
        await expect(this.contracts.yToken.connect(this.signers.brad).mint(Zero)).to.be.revertedWith(
          YTokenErrors.MintZero,
        );
      });
    });
  });

  describe("when the vault is not open", function () {
    it("reverts", async function () {
      await expect(this.contracts.yToken.connect(this.signers.brad).mint(OneHundredTokens)).to.be.revertedWith(
        YTokenErrors.VaultNotOpen,
      );
    });
  });
}

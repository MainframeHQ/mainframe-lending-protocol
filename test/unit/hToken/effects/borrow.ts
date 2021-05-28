import { BigNumber } from "@ethersproject/bignumber";
import { Zero } from "@ethersproject/constants";
import { expect } from "chai";
import fp from "evm-fp";

import { FINTROLLER_DEFAULT_COLLATERALIZATION_RATIO, H_TOKEN_EXPIRATION_TIME } from "../../../../helpers/constants";
import { GenericErrors, HTokenErrors } from "../../../../helpers/errors";
import { contextForTimeDependentTests } from "../../../contexts";
import { increaseTime } from "../../../jsonRpc";
import { stubIsVaultOpen, stubVaultFreeCollateral, stubVaultLockedCollateral } from "../../stubs";

export default function shouldBehaveLikeBorrow(): void {
  const borrowAmount: BigNumber = fp("100");
  const collateralAmount: BigNumber = fp("10");

  context("when the vault is not open", function () {
    beforeEach(async function () {
      await this.stubs.balanceSheet.mock.isVaultOpen
        .withArgs(this.contracts.hToken.address, this.signers.borrower.address)
        .returns(false);
    });

    it("reverts", async function () {
      await expect(this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount)).to.be.revertedWith(
        GenericErrors.VaultNotOpen,
      );
    });
  });

  context("when the vault is open", function () {
    beforeEach(async function () {
      await stubIsVaultOpen.call(this, this.contracts.hToken.address, this.signers.borrower.address);
    });

    contextForTimeDependentTests("when the bond matured", function () {
      beforeEach(async function () {
        await increaseTime(H_TOKEN_EXPIRATION_TIME);
      });

      it("reverts", async function () {
        await expect(this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount)).to.be.revertedWith(
          GenericErrors.BondMatured,
        );
      });
    });

    context("when the bond did not mature", function () {
      context("when the amount to borrow is zero", function () {
        it("reverts", async function () {
          await expect(this.contracts.hToken.connect(this.signers.borrower).borrow(Zero)).to.be.revertedWith(
            HTokenErrors.BorrowZero,
          );
        });
      });

      context("when the amount to borrow is not zero", function () {
        context("when the bond is not listed", function () {
          beforeEach(async function () {
            await this.stubs.fintroller.mock.getBorrowAllowed
              .withArgs(this.contracts.hToken.address)
              .revertsWithReason(GenericErrors.BondNotListed);
          });

          it("reverts", async function () {
            await expect(this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount)).to.be.revertedWith(
              GenericErrors.BondNotListed,
            );
          });
        });

        context("when the bond is listed", function () {
          beforeEach(async function () {
            await this.stubs.fintroller.mock.getBondCollateralizationRatio
              .withArgs(this.contracts.hToken.address)
              .returns(FINTROLLER_DEFAULT_COLLATERALIZATION_RATIO);
          });

          context("when the fintroller does not allow borrows", function () {
            beforeEach(async function () {
              await this.stubs.fintroller.mock.getBorrowAllowed.withArgs(this.contracts.hToken.address).returns(false);
            });

            it("reverts", async function () {
              await expect(
                this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount),
              ).to.be.revertedWith(HTokenErrors.BorrowNotAllowed);
            });
          });

          context("when the fintroller allows borrows", function () {
            beforeEach(async function () {
              await this.stubs.fintroller.mock.getBorrowAllowed.withArgs(this.contracts.hToken.address).returns(true);
            });

            context("when the borrow overflows the debt ceiling", function () {
              beforeEach(async function () {
                await this.stubs.fintroller.mock.getBondDebtCeiling
                  .withArgs(this.contracts.hToken.address)
                  .returns(Zero);
              });

              it("reverts", async function () {
                await expect(
                  this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount),
                ).to.be.revertedWith(HTokenErrors.BorrowDebtCeilingOverflow);
              });
            });

            context("when the borrow does not overflow the debt ceiling", function () {
              beforeEach(async function () {
                await this.stubs.fintroller.mock.getBondDebtCeiling
                  .withArgs(this.contracts.hToken.address)
                  .returns(fp("100"));
              });

              context("when the caller did not deposit any collateral", function () {
                beforeEach(async function () {
                  // The hToken makes an internal call to this stubbed function.
                  await this.stubs.balanceSheet.mock.getHypotheticalCollateralizationRatio
                    .withArgs(this.contracts.hToken.address, this.signers.borrower.address, Zero, borrowAmount)
                    .returns(Zero);
                });

                it("reverts", async function () {
                  await expect(
                    this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount),
                  ).to.be.revertedWith(HTokenErrors.BorrowLockedCollateralZero);
                });
              });

              context("when the caller deposited collateral", function () {
                context("when the caller did not lock the collateral", function () {
                  beforeEach(async function () {
                    // Stub the value of the free collateral.
                    await stubVaultFreeCollateral.call(
                      this,
                      this.contracts.hToken.address,
                      this.signers.borrower.address,
                      collateralAmount,
                    );

                    // The hToken makes an internal call to this stubbed function.
                    await this.stubs.balanceSheet.mock.getHypotheticalCollateralizationRatio
                      .withArgs(this.contracts.hToken.address, this.signers.borrower.address, Zero, borrowAmount)
                      .returns(Zero);
                  });

                  it("reverts", async function () {
                    await expect(
                      this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount),
                    ).to.be.revertedWith(HTokenErrors.BorrowLockedCollateralZero);
                  });
                });

                context("when the caller locked the collateral", function () {
                  beforeEach(async function () {
                    await stubVaultLockedCollateral.call(
                      this,
                      this.contracts.hToken.address,
                      this.signers.borrower.address,
                      collateralAmount,
                    );
                  });

                  context("when the user is dangerously collateralized", function () {
                    const dangerousCollateralizationRatio: BigNumber = fp("1.20");

                    beforeEach(async function () {
                      await this.stubs.balanceSheet.mock.getHypotheticalCollateralizationRatio
                        .withArgs(
                          this.contracts.hToken.address,
                          this.signers.borrower.address,
                          collateralAmount,
                          borrowAmount,
                        )
                        .returns(dangerousCollateralizationRatio);
                    });

                    it("reverts", async function () {
                      await expect(
                        this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount),
                      ).to.be.revertedWith(GenericErrors.BelowCollateralizationRatio);
                    });
                  });

                  context("when the user is safely collateralized", function () {
                    const safeCollateralizationRatio: BigNumber = fp("10.00");

                    beforeEach(async function () {
                      await this.stubs.balanceSheet.mock.getHypotheticalCollateralizationRatio
                        .withArgs(
                          this.contracts.hToken.address,
                          this.signers.borrower.address,
                          collateralAmount,
                          borrowAmount,
                        )
                        .returns(safeCollateralizationRatio);
                    });

                    context("when the call to increase the new vault debt does not succeed", function () {
                      beforeEach(async function () {
                        await this.stubs.balanceSheet.mock.increaseVaultDebt
                          .withArgs(this.contracts.hToken.address, this.signers.borrower.address, borrowAmount)
                          .reverts();
                      });

                      it("reverts", async function () {
                        await expect(
                          this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount),
                        ).to.be.reverted;
                      });
                    });

                    context("when the call to set the new vault debt succeeds", function () {
                      beforeEach(async function () {
                        await this.stubs.balanceSheet.mock.increaseVaultDebt
                          .withArgs(this.contracts.hToken.address, this.signers.borrower.address, borrowAmount)
                          .returns();
                      });

                      it("borrows hTokens", async function () {
                        const oldBalance: BigNumber = await this.contracts.hToken.balanceOf(
                          this.signers.borrower.address,
                        );
                        await this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount);
                        const newBalance: BigNumber = await this.contracts.hToken.balanceOf(
                          this.signers.borrower.address,
                        );
                        expect(oldBalance).to.equal(newBalance.sub(borrowAmount));
                      });

                      it("emits a Borrow event", async function () {
                        await expect(this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount))
                          .to.emit(this.contracts.hToken, "Borrow")
                          .withArgs(this.signers.borrower.address, borrowAmount);
                      });

                      it("emits a Mint event", async function () {
                        await expect(this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount))
                          .to.emit(this.contracts.hToken, "Mint")
                          .withArgs(this.signers.borrower.address, borrowAmount);
                      });

                      it("emits a Transfer event", async function () {
                        await expect(this.contracts.hToken.connect(this.signers.borrower).borrow(borrowAmount))
                          .to.emit(this.contracts.hToken, "Transfer")
                          .withArgs(this.contracts.hToken.address, this.signers.borrower.address, borrowAmount);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}
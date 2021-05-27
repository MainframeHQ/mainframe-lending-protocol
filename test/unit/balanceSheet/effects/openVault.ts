import { expect } from "chai";

import { BalanceSheetErrors, GenericErrors } from "../../../../helpers/errors";

export default function shouldBehaveLikeOpenVault(): void {
  describe("when the bond is not listed", function () {
    beforeEach(async function () {
      await this.stubs.fintroller.mock.isBondListed.withArgs(this.stubs.hToken.address).returns(false);
    });

    it("reverts", async function () {
      await expect(
        this.contracts.balanceSheet.connect(this.signers.borrower).openVault(this.stubs.hToken.address),
      ).to.be.revertedWith(GenericErrors.BondNotListed);
    });
  });

  describe("when the bond is listed", function () {
    beforeEach(async function () {
      await this.stubs.fintroller.mock.isBondListed.withArgs(this.stubs.hToken.address).returns(true);
    });

    describe("when the vault is open", function () {
      beforeEach(async function () {
        await this.contracts.balanceSheet.connect(this.signers.borrower).openVault(this.stubs.hToken.address);
      });

      it("reverts", async function () {
        await expect(
          this.contracts.balanceSheet.connect(this.signers.borrower).openVault(this.stubs.hToken.address),
        ).to.be.revertedWith(GenericErrors.VaultOpen);
      });
    });

    describe("when the vault is not open", function () {
      describe("when the hToken is not compliant", function () {
        beforeEach(async function () {
          await this.stubs.hToken.mock.isHToken.returns(false);
        });

        it("reverts", async function () {
          await expect(
            this.contracts.balanceSheet.connect(this.signers.borrower).openVault(this.stubs.hToken.address),
          ).to.be.revertedWith(BalanceSheetErrors.OpenVaultHTokenInspection);
        });
      });

      describe("when the hToken is compliant", function () {
        it("opens the vault", async function () {
          await this.contracts.balanceSheet.connect(this.signers.borrower).openVault(this.stubs.hToken.address);
        });

        it("emits an OpenVault event", async function () {
          await expect(this.contracts.balanceSheet.connect(this.signers.borrower).openVault(this.stubs.hToken.address))
            .to.emit(this.contracts.balanceSheet, "OpenVault")
            .withArgs(this.stubs.hToken.address, this.signers.borrower.address);
        });
      });
    });
  });
}

import { expect } from "chai";

export default function shouldBehaveLikeOpenVault(): void {
  describe("when the vault is open", function () {
    beforeEach(async function () {
      await this.contracts.balanceSheet.connect(this.signers.brad).openVault(this.stubs.yToken.address);
    });

    it("retrieves true", async function () {
      const isVaultOpen: boolean = await this.contracts.balanceSheet.isVaultOpen(
        this.stubs.yToken.address,
        this.accounts.brad,
      );
      expect(isVaultOpen).to.equal(true);
    });
  });

  describe("when the vault is not open", function () {
    it("retrieves false", async function () {
      const isVaultOpen: boolean = await this.contracts.balanceSheet.isVaultOpen(
        this.stubs.yToken.address,
        this.accounts.brad,
      );
      expect(isVaultOpen).to.equal(false);
    });
  });
}
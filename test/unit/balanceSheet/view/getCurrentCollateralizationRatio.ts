import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";

import { percentages, tokenAmounts } from "../../../../helpers/constants";

export default function shouldBehaveLikeGetCurrentCollateralizationRatio(): void {
  const debt: BigNumber = tokenAmounts.oneHundred;
  const lockedCollateral: BigNumber = tokenAmounts.ten;

  beforeEach(async function () {
    await this.stubs.fintroller.mock.isBondListed.withArgs(this.stubs.hToken.address).returns(true);
    await this.contracts.balanceSheet.connect(this.signers.borrower).openVault(this.stubs.hToken.address);
    await this.contracts.balanceSheet.__godMode_setVaultLockedCollateral(
      this.stubs.hToken.address,
      this.signers.borrower.address,
      lockedCollateral,
    );
    await this.contracts.balanceSheet.__godMode_setVaultDebt(
      this.stubs.hToken.address,
      this.signers.borrower.address,
      debt,
    );
  });

  it("returns the current collateralization ratio", async function () {
    const currentCollateralizationRatio: BigNumber = await this.contracts.balanceSheet.getCurrentCollateralizationRatio(
      this.stubs.hToken.address,
      this.signers.borrower.address,
    );
    expect(currentCollateralizationRatio).to.equal(percentages.oneThousand);
  });
}

import { expect } from "chai";

export default function shouldBehaveLikeCollateralGetter(): void {
  it("retrieves the contract address of the collateral asset", async function () {
    const collateralAddress: string = await this.contracts.yToken.collateral();
    expect(collateralAddress).to.equal(this.stubs.collateral.address);
  });
}

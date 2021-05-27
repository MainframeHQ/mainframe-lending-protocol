import { unitFixtureRedemptionPool } from "../fixtures";
import { shouldBehaveLikeRedemptionPool } from "./RedemptionPool.behavior";

export function unitTestRedemptionPool(): void {
  describe("RedemptionPool", function () {
    beforeEach(async function () {
      const { fintroller, redemptionPool, underlying, hToken } = await this.loadFixture(unitFixtureRedemptionPool);
      this.contracts.redemptionPool = redemptionPool;
      this.stubs.fintroller = fintroller;
      this.stubs.underlying = underlying;
      this.stubs.hToken = hToken;
    });

    shouldBehaveLikeRedemptionPool();
  });
}

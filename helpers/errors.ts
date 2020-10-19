export enum AdminErrors {
  NotAdmin = "ERR_NOT_ADMIN",
}

export enum BalanceSheetErrors {
  ClutchCollateralNotAuthorized = "ERR_CLUTCH_COLLATERAL_NOT_AUTHORIZED",
  DepositCollateralZero = "ERR_DEPOSIT_COLLATERAL_ZERO",
  DepositCollateralNotAllowed = "ERR_DEPOSIT_COLLATERAL_NOT_ALLOWED",
  FreeCollateralInsufficientLockedCollateral = "ERR_FREE_COLLATERAL_INSUFFICIENT_LOCKED_COLLATERAL",
  FreeCollateralZero = "ERR_FREE_COLLATERAL_ZERO",
  GetClutchableCollateralZero = "ERR_GET_CLUTCHABLE_COLLATERAL_ZERO",
  GetHypotheticalCollateralizationRatioDebtZero = "ERR_GET_HYPOTHETICAL_COLLATERALIZATION_RATIO_DEBT_ZERO",
  LockCollateralInsufficientFreeCollateral = "ERR_LOCK_COLLATERAL_INSUFFICIENT_FREE_COLLATERAL",
  LockCollateralZero = "ERR_LOCK_COLLATERAL_ZERO",
  SetVaultDebtNotAuthorized = "ERR_SET_VAULT_DEBT_NOT_AUTHORIZED",
  WithdrawCollateralInsufficientFreeCollateral = "ERR_WITHDRAW_COLLATERAL_INSUFFICIENT_FREE_COLLATERAL",
  WithdrawCollateralZero = "ERR_WITHDRAW_COLLATERAL_ZERO",
}

export enum CarefulMathErrors {
  NoError = 0,
}

export enum Erc20PermitErrors {
  Expired = "ERR_ERC20_PERMIT_EXPIRED",
  InvalidSignature = "ERR_ERC20_PERMIT_INVALID_SIGNATURE",
  OwnerZeroAddress = "ERR_ERC20_PERMIT_OWNER_ZERO_ADDRESS",
  RecoveredOwnerZeroAddress = "ERR_ERC20_PERMIT_RECOVERED_OWNER_ZERO_ADDRESS",
  SpenderZeroAddress = "ERR_ERC20_PERMIT_SPENDER_ZERO_ADDRESS",
}

export enum FintrollerErrors {
  BondNotListed = "ERR_BOND_NOT_LISTED",
  SetCollateralizationRatioLowerBound = "ERR_SET_COLLATERALIZATION_RATIO_LOWER_BOUND",
  SetCollateralizationRatioUpperBound = "ERR_SET_COLLATERALIZATION_RATIO_UPPER_BOUND",
  SetDebtCeilingZero = "ERR_SET_DEBT_CEILING_ZERO",
  SetLiquidationIncentiveLowerBound = "ERR_SET_LIQUIDATION_INCENTIVE_LOWER_BOUND",
  SetLiquidationIncentiveUpperBound = "ERR_SET_LIQUIDATION_INCENTIVE_UPPER_BOUND",
  SetOracleZeroAddress = "ERR_SET_ORACLE_ZERO_ADDRESS",
}

export enum GenericErrors {
  AccountNotUnderwater = "ERR_ACCOUNT_NOT_UNDERWATER",
  BelowCollateralizationRatio = "ERR_BELOW_COLLATERALIZATION_RATIO",
  BondMatured = "ERR_BOND_MATURED",
  BondNotMatured = "ERR_BOND_NOT_MATURED",
  Initialized = "ERR_INITALIZED",
  NotInitialized = "ERR_NOT_INITALIZED",
  VaultOpen = "ERR_VAULT_OPEN",
  VaultNotOpen = "ERR_VAULT_NOT_OPEN",
}

export enum Erc20RecoverErrors {
  RecoverZero = "ERR_RECOVER_ZERO",
  RecoverNonRecoverableToken = "ERR_RECOVER_NON_RECOVERABLE_TOKEN",
  SetNonRecoverableTokensEmptyArray = "ERR_SET_NON_RECOVERABLE_TOKENS_EMPTY_ARRAY",
}

export enum OraclePriceScalarErrors {
  GetScaledPriceZero = "ERR_GET_SCALED_PRICE_ZERO",
  MathError = "ERR_TEST_GET_SCALED_PRICE_MATH_ERROR",
}

export enum RedemptionPoolErrors {
  RedeemYTokensInsufficientUnderlying = "ERR_REDEEM_YTOKENS_INSUFFICIENT_UNDERLYING",
  RedeemYTokensNotAllowed = "ERR_REDEEM_YTOKENS_NOT_ALLOWED",
  RedeemYTokensZero = "ERR_REDEEM_YTOKENS_ZERO",
  SupplyUnderlyingNotAllowed = "ERR_SUPPLY_UNDERLYING_NOT_ALLOWED",
  SupplyUnderlyingZero = "ERR_SUPPLY_UNDERLYING_ZERO",
}

export enum YTokenErrors {
  BorrowDebtCeilingOverflow = "ERR_BORROW_DEBT_CEILING_OVERFLOW",
  BorrowLockedCollateralZero = "ERR_BORROW_LOCKED_COLLATERAL_ZERO",
  BorrowNotAllowed = "ERR_BORROW_NOT_ALLOWED",
  BorrowZero = "ERR_BORROW_ZERO",
  BurnNotAuthorized = "ERR_BURN_NOT_AUTHORIZED",
  BurnZero = "ERR_BURN_ZERO",
  ConstructorCollateralDecimalsOverflow = "ERR_YTOKEN_CONSTRUCTOR_COLLATERAL_DECIMALS_OVERFLOW",
  ConstructorCollateralDecimalsZero = "ERR_YTOKEN_CONSTRUCTOR_COLLATERAL_DECIMALS_ZERO",
  ConstructorUnderlyingDecimalsOverflow = "ERR_YTOKEN_CONSTRUCTOR_UNDERLYING_DECIMALS_OVERFLOW",
  ConstructorUnderlyingDecimalsZero = "ERR_YTOKEN_CONSTRUCTOR_UNDERLYING_DECIMALS_ZERO",
  LiquidateBorrowNotAllowed = "ERR_LIQUIDATE_BORROW_NOT_ALLOWED",
  LiquidateBorrowSelf = "ERR_LIQUIDATE_BORROW_SELF",
  LiquidateBorrowZero = "ERR_LIQUIDATE_BORROW_ZERO",
  MintNotAuthorized = "ERR_MINT_NOT_AUTHORIZED",
  MintZero = "ERR_MINT_ZERO",
  RepayBorrowInsufficientBalance = "ERR_REPAY_BORROW_INSUFFICIENT_BALANCE",
  RepayBorrowInsufficientDebt = "ERR_REPAY_BORROW_INSUFFICIENT_DEBT",
  RepayBorrowNotAllowed = "ERR_REPAY_BORROW_NOT_ALLOWED",
  RepayBorrowZero = "ERR_REPAY_BORROW_ZERO",
}
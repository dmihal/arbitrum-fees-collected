import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { Fee } from "../generated/schema"
import { BalanceChecker } from "../generated/Fees/BalanceChecker"

let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()

let FEE_COLLECTOR = Address.fromString('0x18A08f3CA72DC4B5928c26648958655690b215ac')
let BALANCE_CHECKER = Address.fromString('0x153B436E5Ea474f155f9A494EE954cD8D5be3247')

export function handleBlock(block: ethereum.Block): void {
  let entity = Fee.load('1')
  if (!entity) {
    entity = new Fee('1')
    entity.totalFeesETH = BigInt.fromI32(0).toBigDecimal()
  }

  let checker = BalanceChecker.bind(BALANCE_CHECKER)

  let totalFeesWei = checker.balanceOf(FEE_COLLECTOR)

  entity.totalFeesETH = totalFeesWei.divDecimal(EIGHTEEN_DECIMALS)
  entity.save()
}

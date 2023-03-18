import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { Fee } from "../generated/schema"
import { BalanceChecker } from "../generated/Fees/BalanceChecker"

let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()

let SEQUENCER_FEES = Address.fromString('0x18A08f3CA72DC4B5928c26648958655690b215ac')
let NETWORK_INFRA_FEES = Address.fromString('0x582A62dB643BCFF3B0Bf1DA45f812e3a354d7518')
let CONGESTION_FEES = Address.fromString('0xb04D2C62c0Cd8cec5691Cefd2E7CF041EBD26382')
let SEQUENCER_FEES_NITRO = Address.fromString('0xa4b1E63Cb4901E327597bc35d36FE8a23e4C253f')
let NETWORK_INFRA_FEES_NITRO = Address.fromString('0xD345e41aE2cb00311956aA7109fC801Ae8c81a52')
let CONGESTION_FEES_NITRO = Address.fromString('0xa4B00000000000000000000000000000000000F6')
let BALANCE_CHECKER = Address.fromString('0x153B436E5Ea474f155f9A494EE954cD8D5be3247')
let SEQUENCER_FEES_2 = Address.fromString('0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc')

// These are new fee receiver contracts controlled by Arbitrum DAO
let L1_BASEFEE_RECEIVER = Address.fromString('0xE6ec2174539a849f9f3ec973C66b333eD08C0c18')
let L1_SURPLUS_RECEIVER = Address.fromString('0x2E041280627800801E90E9Ac83532fadb6cAd99A')
let L2_BASEFEE_RECEIVER = Address.fromString('0xbF5041Fc07E1c866D15c749156657B8eEd0fb649')
let L2_SURPLUS_RECEIVER = Address.fromString('0x32e7AF5A8151934F3787d0cD59EB6EDd0a736b1d')

export function handleBlock(block: ethereum.Block): void {
  let timestamp = block.timestamp.toI32()
  let dayID = timestamp / 86400 // rounded

  let entity = Fee.load(dayID.toString())
  if (!entity) {
    entity = new Fee(dayID.toString())

    let checker = BalanceChecker.bind(BALANCE_CHECKER)

    let feesWei1 = checker.balanceOf(SEQUENCER_FEES)
    let feesWei2 = checker.balanceOf(NETWORK_INFRA_FEES)
    let feesWei3 = checker.balanceOf(CONGESTION_FEES)
    let feesWei4 = checker.balanceOf(SEQUENCER_FEES_NITRO)
    let feesWei5 = checker.balanceOf(NETWORK_INFRA_FEES_NITRO)
    let feesWei6 = checker.balanceOf(CONGESTION_FEES_NITRO)
    let feesWei7 = checker.balanceOf(SEQUENCER_FEES_2)
    let feesWei8 = checker.balanceOf(L1_BASEFEE_RECEIVER)
    let feesWei9 = checker.balanceOf(L1_SURPLUS_RECEIVER)
    let feesWei10 = checker.balanceOf(L2_BASEFEE_RECEIVER)
    let feesWei11 = checker.balanceOf(L2_SURPLUS_RECEIVER)    

    entity.totalFeesETH = feesWei1.plus(feesWei2).plus(feesWei3)
                                  .plus(feesWei4).plus(feesWei5).plus(feesWei6).plus(feesWei7)
                                  .plus(feesWei8).plus(feesWei9).plus(feesWei10).plus(feesWei11)
                                  .divDecimal(EIGHTEEN_DECIMALS)
    entity.save()
  }
}

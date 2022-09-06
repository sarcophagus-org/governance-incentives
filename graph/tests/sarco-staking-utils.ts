import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { OnStake, OnUnstake } from "../generated/sarcoStaking/sarcoStaking"

export function createOnStakeEvent(sender: Address, amount: BigInt): OnStake {
  let onStakeEvent = changetype<OnStake>(newMockEvent())

  onStakeEvent.parameters = new Array()

  onStakeEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  onStakeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return onStakeEvent
}

export function createOnUnstakeEvent(
  sender: Address,
  amount: BigInt
): OnUnstake {
  let onUnstakeEvent = changetype<OnUnstake>(newMockEvent())

  onUnstakeEvent.parameters = new Array()

  onUnstakeEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  onUnstakeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return onUnstakeEvent
}

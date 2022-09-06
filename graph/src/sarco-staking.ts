import { OnStake } from "../generated/sarcoStaking/sarcoStaking"
import { Transfer } from "../generated/schema"

 export function handleOnStake(event: OnStake): void {

  let id = event.transaction.hash.toHex()
  let transfer = new Transfer(id)

  // Set properties on the entity, using the event parameters
  transfer.from = event.params.sender
  transfer.amount = event.params.amount

  transfer.save();
}


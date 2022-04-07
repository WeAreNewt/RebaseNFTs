import {  NewStake , NewUnstake } from '../generated/RebaseNFTs/RebaseNFTs'
import { Stake, Unstake } from '../generated/schema'



export function handleStake(event: NewStake): void {
  let stakeId = event.transaction.hash.toHex()
  let stake = new Stake(stakeId)

  stake.nftid = event.params.id
  stake.amount = event.params.amount
  stake.hash = event.transaction.hash.toHex()
  stake.save()

}

export function handleUnstake(event: NewUnstake): void {
  let unstakeId = event.transaction.hash.toHex()
  let unstake = new Unstake(unstakeId)

  unstake.nftid = event.params.id
  unstake.amount = event.params.amount
  unstake.hash = event.transaction.hash.toHex()
  unstake.save()
}
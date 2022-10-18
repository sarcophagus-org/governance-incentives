import { ethers } from 'hardhat';
import type { Collection } from '../../typechain-types/contracts/Collection';
import { Collection__factory } from '../../typechain-types/factories/contracts/Collection__factory';
import { main } from '../index';
require('dotenv').config();

export async function distribution() {
  const signers = await ethers.getSigners();

  console.log('collection contract address:', process.env.COLLECTION_CONTRACT_ADDRESS);
  const collection: Collection = Collection__factory.connect(
    process.env.COLLECTION_CONTRACT_ADDRESS!,
    signers[0]
  );

  console.log('unallocated before', await collection.connect(signers[0]).unallocatedRewards());
  const scriptInput = await collection.connect(signers[0]).unallocatedRewards();
  const distributionArray = await main(scriptInput);

  await collection.connect(signers[0]).allocateRewards(distributionArray);
  console.log('unallocated after', await collection.connect(signers[0]).unallocatedRewards());
  console.log('claimable by voters:', await collection.connect(signers[0]).claimableByVoters());
}

export async function getInternalBalance(address: string) {
  const signers = await ethers.getSigners();

  const collection: Collection = Collection__factory.connect(
    process.env.COLLECTION_CONTRACT_ADDRESS!,
    signers[0]
  );

  const addressBalance = await collection.balanceOf(address);
  return addressBalance;
}

distribution()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

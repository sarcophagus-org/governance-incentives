import type { Collection } from '../../typechain-types/contracts/Collection';
import { Collection__factory } from '../../typechain-types/factories/contracts/Collection__factory';
import { calculateRewardsAmounts } from '../index';
import * as hre from 'hardhat';

require('dotenv').config();

export async function distribution() {
  // const signers = await ethers.getSigners();

  console.log('collection contract address:', process.env.COLLECTION_CONTRACT_ADDRESS);

  // TODO: how to set it as Signer | Provider type
  const { deployer } = await hre.getNamedAccounts();

  console.log(deployer);
  const collection: Collection = Collection__factory.connect(
    process.env.COLLECTION_CONTRACT_ADDRESS!,
    deployer
  );

  const scriptInput = await collection.connect(deployer).unallocatedRewards();

  const distributionArray = await calculateRewardsAmounts(scriptInput);

  await collection.connect(deployer).allocateRewards(distributionArray);
  console.log('unallocated after', await collection.connect(deployer).unallocatedRewards());
  console.log('claimable by voters:', await collection.connect(deployer).claimableByVoters());
}

distribution()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

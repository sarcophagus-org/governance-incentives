import type { Collection } from '../../typechain-types/contracts/Collection';
import { Collection__factory } from '../../typechain-types/factories/contracts/Collection__factory';
import { calculateRewardsAmounts } from '../index';
import hre from 'hardhat';

require('dotenv').config();

export async function distribution() {
  console.log('collection contract address:', process.env.COLLECTION_CONTRACT_ADDRESS);

  const { deployer } = await hre.getNamedAccounts();
  const signer = await hre.ethers.getSigner(deployer);

  const collection: Collection = Collection__factory.connect(
    process.env.COLLECTION_CONTRACT_ADDRESS!,
    signer
  );

  const scriptInput = await collection.unallocatedRewards();
  const distributionArray = await calculateRewardsAmounts(scriptInput);
  console.log(distributionArray);

  console.log('claimable by voters before allocation:', await collection.claimableByVoters());
  // allocate rewards to voters
  await collection.connect(signer).allocateRewards(distributionArray);
  console.log('claimable by voters:', await collection.connect(deployer).claimableByVoters());
  console.log(
    'internal balance last voter sanity check:',
    await collection.connect(deployer).balanceOf('0xe294dc2cbb49472be1cf2beeff971d45859bb89c')
  );
}

distribution()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

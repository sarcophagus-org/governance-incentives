import { ethers } from 'hardhat';
import type { Collection } from '../typechain-types/contracts/Collection';
import { Collection__factory } from '../typechain-types/factories/contracts/Collection__factory';
import { main } from '../src/index';
require('dotenv').config();

// change script name and function name
async function hello() {
  const signers = await ethers.getSigners();
  console.log('collection contract address:', process.env.COLLECTION_CONTRACT_ADDRESS);

  const collection: Collection = Collection__factory.connect(
    process.env.COLLECTION_CONTRACT_ADDRESS!,
    signers[0]
  );

  console.log('unallocated before', await collection.unallocatedRewards());
  const scriptInput = await collection.unallocatedRewards();
  // import script
  const distributionObject = await main(scriptInput);

  await collection.connect(signers[0]).allocateRewards(distributionObject);
  console.log('unallocated after', await collection.unallocatedRewards());
}

hello()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

import { ethers } from 'hardhat';
import type { Collection } from '../typechain-types/contracts/Collection';
import { Collection__factory } from '../typechain-types/factories/contracts/Collection__factory';
require('dotenv').config();
import { main } from '../src/index';

// change script name and function name
async function hello() {
  const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
  const ethWallet = ethers.Wallet.createRandom();
  // const encryptionWallet = ethers.Wallet.createRandom();
  const signer = rpcProvider.getSigner(ethWallet.address);

  console.log('collection contract address:', process.env.COLLECTION_CONTRACT_ADDRESS);

  // TODO: how to automatically deploy the contract on hardhat?
  const collection: Collection = Collection__factory.connect(
    process.env.COLLECTION_CONTRACT_ADDRESS!,
    signer
  );

  console.log(await collection.unallocatedRewards());
  const scriptInput = await collection.unallocatedRewards();
  // import script
  const distributionObject = await main(scriptInput);

  console.log(account[0]);

  // onlyOwner
  // await collection.allocateRewards(distributionObject);
}

hello()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

import { ethers } from 'hardhat';
import type { Collection } from '../typechain-types/contracts/Collection';
import { Collection__factory } from '../typechain-types/factories/contracts/Collection__factory';
import type { Sarco } from '../typechain-types/contracts/mocks/Sarco';
import { Sarco__factory } from '../typechain-types/factories/contracts/mocks/Sarco__factory';
require('dotenv').config();

async function main() {
  const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
  const ethWallet = ethers.Wallet.createRandom();
  const encryptionWallet = ethers.Wallet.createRandom();
  const signer = rpcProvider.getSigner(ethWallet.address);
  console.log('signer: ', signer);

  console.log('collection contract addy:', process.env.COLLECTION_CONTRACT_ADDRESS);

  // TODO: how to find the collection contract address?
  const Collection: Collection = Collection__factory.connect(
    process.env.COLLECTION_CONTRACT_ADDRESS!,
    signer
  );

  console.log(Collection);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

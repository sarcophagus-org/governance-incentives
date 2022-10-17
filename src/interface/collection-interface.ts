import { ethers } from 'ethers';

import type { Collection } from '../typechain-types/contracts/Collection';
import { Collection__factory } from './typechain-types/factories/contracts/Collection__factory';
import type { Sarco } from './typechain-types/contracts/mocks/Sarco';
import { Sarco__factory } from './typechain-types//factories/contracts/mocks/Sarco__factory';

export const getWeb3Interface = async () => {
  const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
  const ethWallet = ethers.Wallet.createRandom();
  const encryptionWallet = ethers.Wallet.createRandom();
  const signer = rpcProvider.getSigner(ethWallet.address);

  return signer;
};

console.log(getWeb3Interface);

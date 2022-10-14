import { ethers } from 'ethers';
export { Collection__factory } from '../typechain-types/factories/contracts//Collection__factory';

export interface Web3Interface {
  networkName: string;
  ethWallet: ethers.Wallet;
  encryptionWallet: ethers.Wallet;
  signer: ethers.Signer;
}

export const getWeb3Interface = async () => {
  const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
  const ethWallet = ethers.Wallet.createRandom();
  const encryptionWallet = ethers.Wallet.createRandom();
  const signer = rpcProvider.getSigner(ethWallet.address);

  return signer;
};

console.log(getWeb3Interface);

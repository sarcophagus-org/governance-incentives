import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-deploy';
import 'hardhat-contract-sizer';
import '@nomiclabs/hardhat-solhint';

dotenv.config();

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Defining this manually since ethers cannot be access from within the hardhat config
const hashZero = '0x0000000000000000000000000000000000000000000000000000000000000000';

const config: HardhatUserConfig = {
  solidity: '0.8.13',
  namedAccounts: {
    deployer: {
      default: 0,
      mainnet: `privatekey://${process.env.MAINNET_DEPLOYER_PRIVATE_KEY}`,
      goerli: `privatekey://${process.env.GOERLI_DEPLOYER_PRIVATE_KEY}`,
    },
  },
  networks: {
    goerli: {
      chainId: 5,
      url: process.env.GOERLI_PROVIDER || '',
      accounts: [process.env.GOERLI_DEPLOYER_PRIVATE_KEY || hashZero],
    },
    hardhat: {
      accounts: {
        count: 10,
      },
    },
  },
};

export default config;

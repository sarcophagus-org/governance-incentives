import { fetchVoteData, VotingData } from './queries/voting-data';
import { BigNumber, ethers } from 'ethers';
import Web3 from 'web3';
import * as fs from 'fs';
require('dotenv').config();
const zero = ethers.constants.Zero;

if (!process.env.VOTE_ID) {
  throw Error('Vote ID is required as an env variable');
}
// id of the vote to query
const voteId: string = process.env.VOTE_ID;
// TODO: This will come from the collection contract
export const DISTRIBUTION_AMOUNT = ethers.utils.parseEther('100');
// helper variable used to achieve a good decimal approximation in the rewards distribution calculation
const factor = DISTRIBUTION_AMOUNT.div(100000);

// fetch SARCO staking contract that gives stakers voting rights tokens (SarcoVR)
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://${process.env.ETHEREUM_NETWORK}.infura.io/v3/${process.env.INFURA_API_KEY}`
  )
);
const stakingContractABI = JSON.parse(fs.readFileSync('src/abi/sarcoStaking.json', 'utf-8'));
const stakingContract = new web3.eth.Contract(stakingContractABI, process.env.CONTRACT_ADDRESS);

// helper function that sums the BN values of a mapping: used to check the sum of rewards equals the initial amount distributed
export function getSum(distribution: Map<string, BigNumber>): BigNumber {
  let sum = zero;
  for (let i of distribution.keys()) {
    let value: BigNumber = distribution.get(i);
    sum = sum.add(value);
  }
  return sum;
}

// helper function fetching the total SarcoVR held by voters for a single voteId
// used to compute the proportions of rewards to distribute
async function getTotalVotersBalance(voteData: VotingData): Promise<BigNumber> {
  // snapshot blockNumber of vote
  const blockNumber = voteData.snapshotBlockNumber;

  // Retrieve each voter balance synchronously
  const votersBalances = await Promise.all(
    voteData.addresses.map(address =>
      stakingContract.methods.stakeValueAt(address, blockNumber).call()
    )
  );

  // Sum the voter balances
  const totalVotersBalance = votersBalances.reduce((a, b) => a.add(b), zero);

  return totalVotersBalance;
}

export async function main(): Promise<Map<string, BigNumber>> {
  const voteData = await fetchVoteData(web3, voteId);
  // snapshot blockNumber of DAO proposal vote
  const blockNumber = voteData.snapshotBlockNumber;
  // fetch total amount of SarcoVR held by voters for a given voteId
  const totalVoteBalance = await getTotalVotersBalance(voteData);

  // construct mapping of voters' addresses and rewards to be allocated
  const distributionMapping = new Map<string, BigNumber>();
  for (let i = 0; i < voteData.addresses.length; i++) {
    const votingAddress = voteData.addresses[i];
    const stakedValueAt: BigNumber = await stakingContract.methods
      .stakeValueAt(votingAddress, blockNumber)
      .call();

    // percentage and distributionAmount calculations include 'factor' to enable a good decimal approximation in the computation
    const percentage = BigNumber.from(stakedValueAt).mul(factor).div(totalVoteBalance);
    const distributionAmount = DISTRIBUTION_AMOUNT.div(factor).mul(percentage);

    distributionMapping.set(votingAddress, distributionAmount);
  }
  console.log('Distribution Mapping:', distributionMapping);
  console.log('Distribution amount set initially:', ethers.utils.formatEther(DISTRIBUTION_AMOUNT));
  console.log(
    'Sum of voters rewards after distributions calculations: ',
    ethers.utils.formatEther(getSum(distributionMapping))
  );

  return distributionMapping;
}

(async () => {
  await main();
})();

import { fetchVoteData, VotingData } from './queries/voting-data';
import { BigNumber, ethers } from 'ethers';
import Web3 from 'web3';
import * as fs from 'fs';
require('dotenv').config();
export const zero = ethers.constants.Zero;
const ROUNDING_FACTOR = 100000;

export interface Reward {
  voterAddress: string;
  rewardAmount: BigNumber;
}

if (!process.env.VOTE_ID) {
  throw Error('Vote ID is required as an env variable');
}
// ID of the vote to query
export const voteId: string = process.env.VOTE_ID;

// fetch SARCO staking contract that gives stakers voting rights tokens (SarcoVR)
export const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://${process.env.ETHEREUM_NETWORK}.infura.io/v3/${process.env.INFURA_API_KEY}`
  )
);
const stakingContractABI = JSON.parse(fs.readFileSync('src/abi/sarcoStaking.json', 'utf-8'));
const stakingContract = new web3.eth.Contract(
  stakingContractABI,
  process.env.STAKING_CONTRACT_ADDRESS
);

// helper function fetching the total SarcoVR held by voters for a certain vote
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

export async function calculateRewardsAmounts(
  TotalDistributionAmount: BigNumber
): Promise<Reward[]> {
  const voteData = await fetchVoteData(web3, voteId);
  // snapshot blockNumber of DAO proposal vote
  const blockNumber = voteData.snapshotBlockNumber;
  // fetch total amount of SarcoVR held by voters for a given voteId
  const totalVoteBalance = await getTotalVotersBalance(voteData);

  // construct object array of voters' addresses and rewards to be allocated
  const rewardsObject: Reward[] = [];
  console.log('Vote ID: ', process.env.VOTE_ID);
  for (let i = 0; i < voteData.addresses.length; i++) {
    const votingAddress = voteData.addresses[i];
    const stakedValueAt: BigNumber = await stakingContract.methods
      .stakeValueAt(votingAddress, blockNumber)
      .call();
    // percentage and distributionAmount calculations include 'factor' to enable a good decimal approximation in the computation
    const factor = TotalDistributionAmount.div(ROUNDING_FACTOR);
    const percentage = BigNumber.from(stakedValueAt).mul(factor).div(totalVoteBalance);
    const distributionAmount = TotalDistributionAmount.div(factor).mul(percentage).toString();

    console.log('voter with address %s reward amount: ', votingAddress);
    console.log(Number(ethers.utils.formatEther(distributionAmount)).toFixed(3), ' SARCO');
    console.log('---');

    rewardsObject[i] = {
      voterAddress: votingAddress,
      rewardAmount: BigNumber.from(distributionAmount),
    };
  }

  return rewardsObject;
}

(async () => {
  console.log(await calculateRewardsAmounts(BigNumber.from(process.env.TOTAL_REWARDS_WEI)));
})();

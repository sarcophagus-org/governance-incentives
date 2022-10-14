import { fetchVoteData } from './queries/voting-data';
import { BigNumber, ethers } from 'ethers';
require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');
const zero = ethers.constants.Zero;

// we want to pass by an array of this reward struct
interface Reward {
  _address: string;
  _amount: BigNumber;
}

type Rewards = Array<Reward>;

if (!process.env.VOTE_ID) {
  throw Error('Vote ID is required as an env variable');
}
// id of the vote to query
const voteId: string = process.env.VOTE_ID;
// TODO: This will come from the collection contract
const DISTRIBUTION_AMOUNT = ethers.utils.parseEther('100');
// helper variable used to achieve a good decimal approximation in the rewards distribution calculation
const factor = DISTRIBUTION_AMOUNT.div(100000);

// fetch SARCO staking contract that gives stakers voting rights tokens (SarcoVR)
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://${process.env.ETHEREUM_NETWORK}.infura.io/v3/${process.env.INFURA_API_KEY}`
  )
);
const stakingContractABI = JSON.parse(fs.readFileSync('src/abi/sarcoStaking.json'));
const stakingContract = new web3.eth.Contract(stakingContractABI, process.env.CONTRACT_ADDRESS);

// helper function that sums the BN values of a mapping: used to check the sum of rewards equals the initial amount distributed
function getSum(distributions: Rewards): BigNumber {
  let sum = zero;
  for (let distribution of distributions) {
    sum = sum.add(distribution._amount);
  }
  return sum;
}

// helper function fetching the total SarcoVR held by voters for a single voteId
// used to compute the proportions of rewards to distribute
async function getTotalVotersBalance(_provider: any, _voteId: string | number): Promise<BigNumber> {
  // helper function to query voting data
  const voteData = await fetchVoteData(_provider, _voteId);
  // snapshot blockNumber of vote
  const blockNumber = voteData.snapshotBlockNumber;

  let totalVotersBalance: BigNumber = zero;
  for (let i = 0; i < voteData.addresses.length; i++) {
    const votingAddress = voteData.addresses[i];
    const stakedValueAt: BigNumber = await stakingContract.methods
      .stakeValueAt(votingAddress, blockNumber)
      .call();
    totalVotersBalance = totalVotersBalance.add(stakedValueAt);
  }
  return totalVotersBalance;
}

async function main() {
  const voteData = await fetchVoteData(web3, voteId);
  // snapshot blockNumber of DAO proposal vote
  const blockNumber = voteData.snapshotBlockNumber;
  // fetch total amount of SarcoVR held by voters for a given voteId
  const totalVoteBalance = await getTotalVotersBalance(web3, voteId);

  // construct mapping of voters' addresses and rewards to be allocated
  const distributionObject: Rewards = [];
  for (let i = 0; i < voteData.addresses.length; i++) {
    const votingAddress = voteData.addresses[i];
    const stakedValueAt: BigNumber = await stakingContract.methods
      .stakeValueAt(votingAddress, blockNumber)
      .call();
    // percentage and distributionAmount calculations include 'factor' to enable a good decimal approximation in the computation
    const percentage = BigNumber.from(stakedValueAt).mul(factor).div(totalVoteBalance);
    const distributionAmount = DISTRIBUTION_AMOUNT.div(factor).mul(percentage);

    distributionObject[i] = { _address: votingAddress, _amount: distributionAmount };
  }

  console.log('Distribution Object:', distributionObject);

  console.log('Distribution amount set initially:', ethers.utils.formatEther(DISTRIBUTION_AMOUNT));
  console.log(
    'Sum of voters rewards after distributions calculations: ',
    ethers.utils.formatEther(getSum(distributionObject))
  );
}

(async () => {
  await main();
})();

import { fetchVoteData } from "./queries/voting-data";
import { BigNumber, ethers } from 'ethers';
const Web3 = require("web3");
require("dotenv").config();
const fs = require("fs");
const zero = ethers.constants.Zero

if(!process.env.VOTE_ID) {
  throw Error("Vote ID is required as an env variable")
}

// This is the vote we are distributing rewards for
const voteId = process.env.VOTE_ID

// TODO: This will come from the collections contract
const DISTRIBUTION_AMOUNT = ethers.utils.parseEther('100')
//ethers.utils.parseEther('100')

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://${process.env.ETHEREUM_NETWORK}.infura.io/v3/${process.env.INFURA_API_KEY}`
  )
);

const stakingContractABI  = JSON.parse(fs.readFileSync("src/abi/sarcoStaking.json"));
const stakingContract = new web3.eth.Contract(
  stakingContractABI,
  process.env.CONTRACT_ADDRESS
);

async function main() {
  const voteData = await fetchVoteData(web3, voteId)
  const blockNumber = voteData.snapshotBlockNumber
 
  const didVoteAddresses = new Map<string, BigNumber>()
  let totalVoteBalance: BigNumber = zero
  for (let i = 0; i < voteData.addresses.length; i++) {
    const votingAddress = voteData.addresses[i]
    const stakedValueAt: BigNumber = await stakingContract.methods.stakeValueAt(votingAddress,blockNumber).call()
    totalVoteBalance = totalVoteBalance.add(stakedValueAt)
    didVoteAddresses.set(votingAddress, stakedValueAt)
  }
  
  console.log("didVoteAddresses:",didVoteAddresses)
  console.log("totalVoteBalance:",totalVoteBalance.toString())

  const distributionMapping = new Map<string, BigNumber>();
  for (let i = 0; i < voteData.addresses.length; i++) {
    const votingAddress = voteData.addresses[i]
    const stakedValueAt = BigNumber.from(didVoteAddresses.get(votingAddress))
    const percentage = stakedValueAt.mul(100000000000).div(totalVoteBalance)
    const distributionAmount = DISTRIBUTION_AMOUNT.mul(percentage).div(100000000000)
    distributionMapping.set(votingAddress, distributionAmount)
  }
  console.log("Distribution Mapping:",distributionMapping)
}

(async () => {
  await main()
})();
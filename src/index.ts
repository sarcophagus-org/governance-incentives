import { fetchVoteData } from "./queries/voting-data";
const Web3 = require("web3");
require("dotenv").config();
const fs = require("fs");

if(!process.env.VOTE_ID) {
  throw Error("Vote ID is required as an env variable")
}

// This is the vote we are distributing rewards for
const voteId = process.env.VOTE_ID

// TODO: This will come from the collections contract
const DISTRIBUTION_AMOUNT = 10000

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
 
  const didVoteAddresses = new Map<string, number>()
  let totalVoteBalance = 0
  for (let i = 0; i < voteData.addresses.length; i++) {
    const votingAddress = voteData.addresses[i]
    const stakedValueAt = await stakingContract.methods.stakeValueAt(votingAddress,blockNumber).call()
    totalVoteBalance += +stakedValueAt
    didVoteAddresses.set(votingAddress, stakedValueAt)
  }
  
  const distributionMapping = new Map<string, number>();
  for (let i = 0; i < voteData.addresses.length; i++) {
    const votingAddress = voteData.addresses[i]
    const stakedValueAt = didVoteAddresses.get(votingAddress)
    const percentage = (stakedValueAt / totalVoteBalance)
    const distributionAmount = DISTRIBUTION_AMOUNT * percentage
    distributionMapping.set(votingAddress, distributionAmount)
  }
  console.log(distributionMapping)
}

(async () => {
  await main()
})();
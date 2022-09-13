import { fetchVotingData } from "./queries/voting-data";
const Web3 = require("web3");
require("dotenv").config();
const fs = require("fs");

const abi  = JSON.parse(fs.readFileSync("src/abi/sarcoStaking.json"));

const web3Instance = () => {
  const network = process.env.ETHEREUM_NETWORK;
  return new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );
}

async function main() {
  const web3 = web3Instance()
  
  const contract = new web3.eth.Contract(
    abi,
    process.env.CONTRACT_ADDRESS
  );

  const votesAddresses = await fetchVotingData(web3)
  const blockNumber = votesAddresses.snapshotBlockNumber
 
  const didVoteAddresses = new Map()
  let totalVoteBalance = 0
  for (let i = 0; i < votesAddresses.addresses.length; i++) {
    const votingAddress = votesAddresses.addresses[i]
    const stakedValueAt = await contract.methods.stakeValueAt(votingAddress,blockNumber).call()
    totalVoteBalance += +stakedValueAt
    didVoteAddresses.set(votingAddress, stakedValueAt)
  }

  const totalDistributions = 10000
  const distributionMapping = new Map();
  for (let i = 0; i < votesAddresses.addresses.length; i++) {
    const votingAddress = votesAddresses.addresses[i]
    const stakedValueAt = didVoteAddresses.get(votingAddress)
    const percentage = (stakedValueAt / totalVoteBalance)
    const distributionAmount = totalDistributions * percentage
    distributionMapping.set(votingAddress, distributionAmount)
  }
  console.log(distributionMapping)
}

(async () => {
  await main()
})();
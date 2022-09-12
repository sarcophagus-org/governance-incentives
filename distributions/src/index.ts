import { votingAddresses } from "./queries/voting-addresses"; 
const Web3 = require("web3");
require("dotenv").config();
const fs = require("fs");
//import { BN } from 'web3-utils'

const abi  = JSON.parse(fs.readFileSync("src/abi/sarcoStaking.json"));

async function main() {
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );
  
  const contract = new web3.eth.Contract(
    abi,
    process.env.CONTRACT_ADDRESS
  );
  console.log("votesAddresses starting")
  // async function - we neet to await for something to happen
  const votesAddresses = await votingAddresses()

  console.log(votesAddresses)
 

  

  /*
  try {const votesAddresses = await votingAddresses()
  const didVoteAddresses = new Map();
  let totalVoteBalance = 0
  
  for (let i = 0; i < votesAddresses.addresses.length; i++) {
    const votingAddress = votesAddresses.addresses[i]
    const stakedValueAt = await contract.methods.stakeValueAt(votingAddress,14968124).call();
    totalVoteBalance += stakedValueAt
    didVoteAddresses.set(votingAddress, stakedValueAt);
  }
  console.log(totalVoteBalance)
  console.log(didVoteAddresses)} catch(e) {
    console.log(e);
    throw e; 
  }

  console.log("HEY")
  const totalDistributions = 1000
  const distributionMapping = new Map();
  for (let i = 0; i < votesAddresses.addresses.length; i++) {
    const votingAddress = votesAddresses.addresses[i]
    const stakedValueAt = await contract.methods.stakeValueAt(votingAddress,14968124).call();
    const percentage = web3.utils.toBN(stakedValueAt / totalVoteBalance).toString();
    const distributionAmount = web3.utils.toBN(totalDistributions * percentage).toString();
    distributionMapping.set(votingAddress, distributionAmount)
  }

  console.log(distributionMapping)
  */
  //TODO: figure out why we cannot use the snapshotBlockNumber together with other functions
}


(async () => {
  console.log("Hello")
  await main()
  console.log("Finished")
})();

/*
main().then(() => {
  console.log("All done!")
}).catch(err => {
  console.log(err)
});
*/
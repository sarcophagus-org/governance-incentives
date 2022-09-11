import { votingAddresses } from "./queries/voting-addresses"; 
import { stakingAddresses } from "./queries/staking-addresses";
const Web3 = require("web3");

const fs = require("fs");
const abi  = JSON.parse(fs.readFileSync("src/abi/sarcoStaking.json"));

async function main() {
  console.log("starting")
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );
  
  console.log("contract call")
  const contract = new web3.eth.Contract(
    abi,
    process.env.CONTRACT_ADDRESS
  );

  console.log("starting stakingVrAddresses")
  try {
    //const stakingVrAddresses = await stakingAddresses()
    //console.log(stakingVrAddresses)
  } catch(err){
    console.log("something went wrong in stakingVrAddresses")
    console.log(err)
  }
  console.log("starting votingAddresses")
  try {
  const votesAddresses = await votingAddresses()
  console.log(votesAddresses) 
  const didVoteAddresses = new Map();
  console.log("new map")
  }
  catch(err){
    console.log("something went wrong in votesAddresses")
    console.log(err)
  }

  /*
  const didVoteAddresses = new Map();
  console.log("new map")
  for (let i = 0; i < votesAddresses.addresses.length; i++) {
    const votingAddress = votesAddresses.addresses[i]
    console.log("hello")
    const stakedValueAt = await contract.methods.stakeValueAt(votingAddress,14968124).call();
    didVoteAddresses.set(votingAddress, stakedValueAt);
    console.log("loop completed")
  }
  console.log(didVoteAddresses[0])

  //TODO: figure out why we cannot use the snapshotBlockNumber together with other functions
  

  //Our number.
  const number = 268342822488584468374029;


  //The percent that we want to get.
  //i.e. We want to get 50% of 120.
  const percentToGet = 50;

  //Calculate the percent.
  const percent = (percentToGet / 100) * number;
  */


}

require("dotenv").config();
main().then(() => {
  console.log("All done!")
})
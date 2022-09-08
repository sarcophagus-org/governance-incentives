import { votingAddresses } from "./queries/voting-index"; 
import { stakingAddresses } from "./queries/staking-index-direct";

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
    const stakingVrAddresses = await stakingAddresses()
    console.log(stakingVrAddresses)
  } catch(err){
    console.log("something went wrong in stakingVrAddresses")
    console.log(err)
  }

  
  console.log("starting votingAddresses")
  try {
    const votesAddresses = await votingAddresses()
    console.log(votesAddresses)
  } catch(err) {
    console.log("something went wrong in voting Addresses")
    console.log(err)
  }

  //TODO: figure out why we cannot use the snapshotBlockNumber together with other functions
  
  /*
  const stakingVrBalancesMap = new Map();
  
  for (let i = 0; i < stakingVrAddresses.length; i++) {
    const stakingVrAddress = stakingVrAddresses[i]
    const stakedValueAt = await contract.methods.stakeValueAt(stakingVrAddress,14968124).call();
    stakingVrBalancesMap.set(stakingVrAddress, stakedValueAt);
  }

  console.log(stakingVrBalancesMap)
 

  const didVoteAddresses = new Map();

  for (let i = 0; i < votesAddresses.addresses.length; i++) {
    const votingAddress = votesAddresses.addresses[i]
    const stakedValueAt = await contract.methods.stakeValueAt(votingAddress,14968124).call();
    didVoteAddresses.set(votingAddress, stakedValueAt);
  }

  console.log(didVoteAddresses)
 */
  const didNotVoteAddresses = new Map();
}



require("dotenv").config();
main();
import { stakingAddresses } from "./queries/staking-index";
import { votingAddresses } from "./queries/voting-index"; 

const Web3 = require("web3");

// Loading the Sarco Staking contract ABI
const fs = require("fs");
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

  const stakingVrAddresses = await stakingAddresses();

  //const votesAddresses = await votingAddresses()
  //const snapshotBlockNumber = votesAddresses.snapshotBlockNumber
  //console.log(snapshotBlockNumber)

  const stakingVrBalancesMap = new Map();
  
  for (let i = 0; i < stakingVrAddresses.length; i++) {
    const stakingVrAddress = stakingVrAddresses[i]
    const stakedValueAt = await contract.methods.stakeValueAt(stakingVrAddress,14968124).call();
    stakingVrBalancesMap.set(stakingVrAddress, stakedValueAt);
  }

  console.log(stakingVrBalancesMap)

  const didVoteAddresses = new Map();
  const didNotVoteAddresses = new Map();
  
}



require("dotenv").config();
main();
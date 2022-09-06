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

  const exampleFunction = await contract.methods.totalStakers().call();
  console.log(exampleFunction)
}

require("dotenv").config();
main();
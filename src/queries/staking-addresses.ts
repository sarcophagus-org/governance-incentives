const Web3 = require('web3');
const fs = require('fs');
const abi = JSON.parse(fs.readFileSync('src/abi/sarcoStaking.json'));

/**
 * Returns all addresses that have historically staked Sarco
 * by querying the blockchain for emission of 'OnStake' event
 */
export async function stakingAddresses() {
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`)
  );

  const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

  const onStakeObject = await contract.getPastEvents('OnStake', { fromBlock: 0 });

  const allOnStakeAddresses = onStakeObject
    .map(event => event.returnValues)
    .map(onStake => onStake.sender);
  const onStakeAddresses = [...new Set(allOnStakeAddresses)];
  return onStakeAddresses;
}

require('dotenv').config();

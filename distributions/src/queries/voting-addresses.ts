import { connect } from '@aragon/connect'
import connectVoting, { Vote } from '@aragon/connect-voting'
const Web3 = require("web3");
require('dotenv').config();


const BLUE = '\x1b[36m'
const RESET = '\x1b[0m'

if(!process.env.VOTE_ID) {
  throw Error("Vote ID is required as an env variable")
}

interface VotingData {
  addresses: string[];
  executedBlockNumber: number; 
  snapshotBlockNumber: number;
}

const env = {
  network: parseInt(process.env.CHAIN_ID, 10),
  location: process.env.ORGANIZATION ?? 'sarcophagus.aragonid.eth',
}

function generateVoteId(id: string): any {
  const aragonVoteIdPrefix = "appAddress:0xf483c1f7858dd19915d0689d26cb3487fc90b640-vote:"
  const aragonVoteId = aragonVoteIdPrefix + "0x" + Number(Number(id).toString(16)).toString(16)
  return aragonVoteId
}


export async function votingAddresses(): Promise<VotingData> {
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );
  
  const org = await connect(
    env.location, 
    'thegraph', 
    { 
      network: env.network,
      ethereum: web3.currentProvider
    }
  )

  const voting = await connectVoting(org.app('voting'))
  const votes = await voting.votes({ first: 100 })

  const voteId = generateVoteId(process.env.VOTE_ID)

  const vote = votes.find((v: any) => {
    return v.id === voteId;
  })

  if(!vote) {
    throw Error("Unable to retrieve vote: ${voteId}")
  }

  const casts = await vote.casts()

  const voteWithCast = [{...vote, casts}]

  const myVoteData = {} as VotingData;
  
  for (const vote of voteWithCast) {
    myVoteData.addresses = vote.casts.map(cast => {
      return cast.voter.address 
    })
    myVoteData.executedBlockNumber = vote.executedAt
    myVoteData.snapshotBlockNumber = vote.snapshotBlock
  }

  return myVoteData
}

votingAddresses()
.then(() => process.exit(0))
.catch((err) => {
  console.error('')
  console.error(err)
  process.exit(1)
})
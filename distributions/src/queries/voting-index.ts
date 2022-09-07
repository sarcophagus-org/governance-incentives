import { connect } from '@aragon/connect'
import connectVoting, { Vote } from '@aragon/connect-voting'
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

export async function main() {
  const org = await connect(env.location, 'thegraph', { network: env.network })
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

  printOrganization(org)
  console.log("Vote Id input: ", process.env.VOTE_ID)
  console.log("Aragon Vote Id: ", voteId)
  console.log("Vote details:")
  printVotes(voteWithCast)
}

function printOrganization(organization: any) {
  console.log('')
  console.log(' Organization')
  console.log('')
  console.log('  Location:', BLUE + organization.location + RESET)
  console.log('  Address:', BLUE + organization.address + RESET)
  console.log('')
}
 
function printVotes(votes: any) {
  const myVoteData = {} as VotingData;
  for (const vote of votes) {
    myVoteData.addresses = vote.casts.map(cast => {
      return cast.voter.address 
    })

    myVoteData.executedBlockNumber = vote.executedAt
    myVoteData.snapshotBlockNumber = vote.snapshotBlock

    console.log(myVoteData)
  }
  console.log('')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('')
    console.error(err)
    console.log(
      'Please report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
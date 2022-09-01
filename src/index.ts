import { connect } from '@aragon/connect'
import connectVoting from '@aragon/connect-voting'
import { parseArgs } from 'util';

const BLUE = '\x1b[36m'
const RESET = '\x1b[0m'

interface VotingData {
  addresses?: string[];
  executedBlockNumber: number; 
  snapshotBlockNumber: number;
}


const myVoteData = {} as VotingData;


const env = {
  network: parseInt(process.env.CHAIN_ID, 10),
  location: process.env.ORGANIZATION ?? 'sarcophagus.aragonid.eth',
}

async function main() {
  const org = await connect(env.location, 'thegraph', { network: env.network })
  const voting = await connectVoting(org.app('voting'))
  const votes = await voting.votes({ first: 100 })
  const votesWithCasts = await Promise.all(
    votes.map(async (vote) => ({ ...vote, casts: await vote.casts() }))
  )
  
  printOrganization(org)
  printVotes(votesWithCasts)
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
  console.log(` Votes (${votes.length})`)
  console.log('')
  for (const vote of votes) {
    console.log('  Vote:', `${BLUE}${formatVote(vote)}${RESET}`)
  }
  console.log('')
}

function formatVote(vote: any): string {
  console.log("------------")
  console.log("------------")
  console.log("------------")

  myVoteData.addresses = vote.casts.map(cast => {
    return cast.voter.address 
  })

  myVoteData.executedBlockNumber = vote.executedAt
  myVoteData.snapshotBlockNumber = vote.snapshotBlock

  console.log(myVoteData)
  

  let label = vote.metadata
  label = label.replace(/\n/g, ' ')
  label = label.length > 60 ? label.slice(0, 60) + '…' : label
  return `(${vote.casts.length} casts) ${label || '[Action]'}`
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
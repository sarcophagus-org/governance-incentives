import { connect } from '@aragon/connect';
import connectVoting, { Voting } from '@aragon/connect-voting';
import Web3 from 'web3';

require('dotenv').config();

export interface VotingData {
  addresses: string[];
  executedBlockNumber: number;
  snapshotBlockNumber: number;
}

const aragonEnv = {
  network: parseInt(process.env.CHAIN_ID!, 10),
  location: process.env.ORGANIZATION ?? 'sarcophagus.aragonid.eth',
};

/**
 * Transforms an integer vote ID into an aragon vote id
 * Based on the sarcophagus voting contract address
 *
 * @param id - id of the vote to query (I.E. 21)
 * @param votingContractAddress - voting contract to query -- defaults to the main sarcophagus DAO address
 */
function formatVoteId(
  id: string | number,
  votingContractAddress: string = process.env.VOTING_CONTRACT_ADDRESS as string
): string {
  const aragonVoteIdPrefix = `appAddress:${votingContractAddress}-vote:`;
  const aragonVoteId = aragonVoteIdPrefix + '0x' + Number(Number(id).toString(16)).toString(16);
  return aragonVoteId;
}

/**
 * Retrieves details of vote including address of voters and timing of execution
 *
 * @param web3 - blockchain provider
 * @param voteId - id of the vote to query (I.E. 21)
 */
export async function fetchVoteData(web3: Web3, voteId: string | number): Promise<VotingData> {
  const voteIdFormatted = formatVoteId(voteId);

  // Connect to aragon subgraph to retrieve voting data
  const org = await connect(aragonEnv.location, 'thegraph', {
    network: aragonEnv.network,
    // ethereum: web3.currentProvider,
  });

  // Grab the first 100 votes
  // TODO: will need to consider pagination as vote count exceeds 100
  const voting: Voting = await connectVoting(org.app('voting'));
  const votes = await voting.votes({ first: 100 });

  // Filter the votes to only the provided vote ID
  // since aragon doesn't have a way to target a single vote with a query
  const vote = votes.find((v: any) => {
    return v.id === voteIdFormatted;
  });

  if (!vote) {
    throw Error('Unable to retrieve vote: ${voteId}');
  }

  const casts = await vote.casts();

  return {
    addresses: casts.map(cast => cast.voter.address),
    executedBlockNumber: parseInt(vote.executedAt),
    snapshotBlockNumber: parseInt(vote.snapshotBlock),
  };
}

# Voting incentive rewards distribution script

[![Discord](https://img.shields.io/discord/753398645507883099?color=768AD4&label=discord)](https://discord.com/channels/753398645507883099/)
[![Twitter](https://img.shields.io/twitter/follow/sarcophagusio?style=social)](https://twitter.com/sarcophagusio)

## Overview

This repository contains the scripts that allow to compute the distribution amount of a given reward to those voters that have voted in a Sarco DAO proposal, and distribute those rewards to voters.

The rewards per voter are weighted based on their Sarco-VR holding at the time of the snapshot blocknumber.

## Prerequisites

First, clone the repository

```
git clone ...
```

then, install the necessary dependencies:

```
npm install
```

At the time of this writing, the project currently uses Node v16.15.0. It is recommended to use `nvm use` in root directory to switch to the correct version of Node.

Also Windows users will need to add .npmrc file with the contents script-shell=powershell

## Environment Variables

Copy `.env.example` into `.env` in root directory and update your environment variables.

In `.env` set the VOTE_ID string to the Sarco DAO vote number you want to execute the script and distribution on.

## Reward Distribution Script Execution

In `.env` set your INFURA_API_KEY and TOTAL_REWARDS_WEI as the amount you want to distribute.

To console.log the output of the reward distribution script run in the terminal:

```
npm run start
```

## Distribute Rewards

The script is executed on the deployed Sarco Collection Contract, so its address needs to be added in `.env` COLLECTION_CONTRACT_ADDRESS.

Any unallocated rewards in the Collection Contract will be distributed as rewards to the voters of the selected VOTE_ID in `.env`.

To distribute any unallocated rewards from the Collection Contract run:

```
npm run distribution
```

## Execute Test

```
npm run test
```

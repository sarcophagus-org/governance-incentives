# Voting incentive rewards distribution script

[![Discord](https://img.shields.io/discord/753398645507883099?color=768AD4&label=discord)](https://discord.com/channels/753398645507883099/)
[![Twitter](https://img.shields.io/twitter/follow/sarcophagusio?style=social)](https://twitter.com/sarcophagusio)

## Overview

This repository contains the script that allows to compute the distribution amount of a given reward to those voters that have voted in the Sarco DAO proposal.

The rewards per voter are weighted based on their SARCOVR holding at the time of the snapshot blocknumber.

## Prerequisites

First, clone the repository

```
git clone ...
```

then, install the necessary dependencies:

```
npm install
npm run start
```

At the time of this writing, the project currently uses Node v16.15.0. It is recommended to use `nvm use` in root directory to switch to the correct version of Node.

Also Windows users will need to add .npmrc file with the contents script-shell=powershell

Finally, copy `.env.example` into `.env` in root directory and update your environment variables.

In `.env` set the VOTE_ID string you want to run the script on.

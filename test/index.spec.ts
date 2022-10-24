import { expect } from 'chai';
import { calculateRewardsAmounts, zero, Reward } from '../src/index';
import { describe } from 'mocha';
import { BigNumber, ethers } from 'ethers';

// helper function that sums the BN values of the array of objects Rewards
function getSum(distributions: Reward[]): BigNumber {
  let sum = zero;
  for (let d of distributions) {
    let value: BigNumber = d.rewardAmount;
    sum = sum.add(value);
  }
  return sum;
}

describe('Rewards distribution script', () => {
  it('Sum distributed to voters should be equal to initial amount set to distribute', async () => {
    const TOTAL_REWARDS_AMOUNT = ethers.utils.parseEther('100');
    const rewardsObject = await calculateRewardsAmounts(TOTAL_REWARDS_AMOUNT);
    const rewardsSum = getSum(rewardsObject);

    expect(Number(rewardsSum)).closeTo(Number(TOTAL_REWARDS_AMOUNT), 1000000);
  });
});

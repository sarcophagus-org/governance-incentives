import { expect } from 'chai';
import { main, zero, Rewards, Reward } from '../src/index';
import { describe } from 'mocha';
import { BigNumber, ethers } from 'ethers';

// helper function that sums the BN values of a mapping
// TODO: adapt to Object sum
function getSum(distributions: Rewards): BigNumber {
  let sum = zero;
  for (let distribution of distributions) {
    let value: BigNumber = distribution._amount;
    sum = sum.add(value);
  }
  return sum;
}

describe('Rewards distribution script', () => {
  it('Sum distributed to voters should be equal to initial amount set to distribute', async () => {
    const DISTRIBUTION_AMOUNT = ethers.utils.parseEther('100');
    const distribution = await main(DISTRIBUTION_AMOUNT);
    const distributionSum = getSum(distribution);

    expect(Number(distributionSum)).closeTo(Number(DISTRIBUTION_AMOUNT), 1000000);
  });
});

import { expect } from 'chai';
import { main, DISTRIBUTION_AMOUNT, zero } from '../src/index';
import { describe } from 'mocha';
import { BigNumber } from 'ethers';

// helper function that sums the BN values of a mapping
function getSum(distribution: Map<string, BigNumber>): BigNumber {
  let sum = zero;
  for (let i of distribution.keys()) {
    let value: BigNumber = distribution.get(i);
    sum = sum.add(value);
  }
  return sum;
}

describe('Rewards distribution script', () => {
  it('Sum distributed to voters should be equal to initial amount set to distribute', async () => {
    const distribution = await main();
    const distributionSum = getSum(distribution);

    expect(Number(distributionSum)).closeTo(Number(DISTRIBUTION_AMOUNT), 1000000);
  });
});

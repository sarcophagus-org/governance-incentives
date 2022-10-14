import { expect } from 'chai';
import { main, DISTRIBUTION_AMOUNT, getSum } from '../src/index';
import { describe } from 'mocha';

describe('Rewards distribution script', () => {
  it('Sum distributed to voters should be equal to initial amount set to distribute', async () => {
    const distribution = await main();
    const distributionSum = getSum(distribution);

    expect(Number(distributionSum)).closeTo(Number(DISTRIBUTION_AMOUNT), 1000000);
  });
});

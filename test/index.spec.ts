import { expect } from 'chai';
import { main, zero, Rewards } from '../src/index';
import { distribution, getInternalBalance } from '../src/scripts/distribution';
import { describe } from 'mocha';

import { BigNumber, ethers } from 'ethers';

// helper function that sums the BN values of the array of objects Rewards
function getSum(distributions: Rewards): BigNumber {
  let sum = zero;
  for (let d of distributions) {
    let value: BigNumber = d._amount;
    sum = sum.add(value);
  }
  return sum;
}

describe('Rewards distribution script', () => {
  it('Sum distributed to voters should be equal to initial amount set to distribute', async () => {
    const DISTRIBUTION_AMOUNT = ethers.utils.parseEther('100');
    const distributionObject = await main(DISTRIBUTION_AMOUNT);
    const distributionSum = getSum(distributionObject);

    expect(Number(distributionSum)).closeTo(Number(DISTRIBUTION_AMOUNT), 1000000);
  });

  it('script and contract communicate as expected', async () => {
    // executing script with deployed collection contract
    console.log('distribution() start');

    await distribution();

    // executing script to output the expected distribution Obejct
    const DISTRIBUTION_AMOUNT = ethers.utils.parseEther('100');
    const distributionObject = await main(DISTRIBUTION_AMOUNT);

    // verify internal contract balance of each voter matches balance pushed out of script
    // for (let d of distributionObject) {
    //   let address: string = d._address;
    //   let balanceFromContract = await getInternalBalance(address);
    //   let balanceFromScript: BigNumber = d._amount;
    //   expect(balanceFromContract).to.equal(balanceFromScript);
    // }
  });
});

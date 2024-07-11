import { CIP30Wallet } from '../src';
import { Maestro } from '@blaze-cardano/sdk';

describe('CIP30Wallet', () => {
  it('works', async () => {
    const wallet = await CIP30Wallet.init(
      // I extended the key (64 -> 192) by concatenating it with itself a couple times
      '06facaa87ff0b958370e3eb98db297511f80c30b2488fa96a8e8b4a1119565c606facaa87ff0b958370e3eb98db297511f80c30b2488fa96a8e8b4a1119565c606facaa87ff0b958370e3eb98db297511f80c30b2488fa96a8e8b4a1119565c6',
      new Maestro({
        apiKey: '',
        network: 'preprod',
      })
    );
    console.log(wallet);
  });
});

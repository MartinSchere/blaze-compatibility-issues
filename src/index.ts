import { WalletApi } from './types';
import { Blaze, Provider, HotWallet, Core } from '@blaze-cardano/sdk';

export class CIP30Wallet<ProviderType extends Provider>
  implements Omit<WalletApi, 'experimental'> {
  private blaze: Blaze<ProviderType, HotWallet>;

  private constructor(blaze: Blaze<ProviderType, HotWallet>) {
    this.blaze = blaze;
  }

  static async init<T extends Provider>(
    privateKey: string,
    provider: T
  ): Promise<CIP30Wallet<T>> {
    const sk = Core.Bip32PrivateKeyHex(privateKey);
    const hw = await HotWallet.fromMasterkey(sk, provider);

    const blaze = new Blaze(provider, hw);

    return new this(blaze);
  }

  getNetworkId(): Promise<number> {
    return this.blaze.wallet.getNetworkId();
  }

  getUtxos(): Promise<string[] | undefined> {
    return this.blaze.wallet
      .getUnspentOutputs()
      .then(utxos => utxos.map(u => u.toCbor()));
  }

  getBalance(): Promise<string> {
    return this.blaze.wallet.getBalance().then(b => b.toCbor());
  }

  getUsedAddresses(): Promise<string[]> {
    return this.blaze.wallet
      .getUsedAddresses()
      .then(addrs => addrs.map(a => a.toBytes()));
  }

  getUnusedAddresses(): Promise<string[]> {
    return this.blaze.wallet
      .getUnusedAddresses()
      .then(addrs => addrs.map(a => a.toBytes()));
  }
  getChangeAddress(): Promise<string> {
    return this.blaze.wallet.getChangeAddress().then(addr => addr.toBytes());
  }
  getRewardAddresses(): Promise<string[]> {
    return this.blaze.wallet
      .getRewardAddresses()
      .then(addrs => addrs.map(a => a.toAddress().toBytes()));
  }

  signTx(tx: string, partialSign: boolean): Promise<string> {
    const txObj = Core.Transaction.fromCbor(Core.TxCBOR(tx));
    return this.blaze.wallet
      .signTransaction(txObj, partialSign)
      .then(signedTx => signedTx.toCbor());
  }

  signData(
    address: string,
    payload: string
  ): Promise<{ signature: string; key: string }> {
    const addrObj = Core.Address.fromBech32(address);
    return this.blaze.wallet.signData(addrObj, payload);
  }

  submitTx(tx: string): Promise<string> {
    const txObj = Core.Transaction.fromCbor(Core.TxCBOR(tx));
    return this.blaze.wallet.postTransaction(txObj);
  }

  getCollateral(): Promise<string[]> {
    return this.blaze.wallet
      .getCollateral()
      .then(collateral => collateral.map(c => c.toCbor()));
  }
}

import { Avalanche, BN } from "avalanche/dist";
import {
  PrivateKeyPrefix,
  DefaultLocalGenesisPrivateKey,
  Defaults,
} from "avalanche/dist/utils";

export default function useExportAvaxPchain() {
  const ip = "api.avax.network";
  const port = 443;
  const protocol = "https";
  const networkID = 1;
  const avalanche = new Avalanche(ip, port, protocol, networkID);
  const pchain = avalanche.PChain();
  const cchain = avalanche.CChain();
  const privKey = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`;
  const pKeychain = pchain.keyChain();
  const cKeychain = cchain.keyChain();
  pKeychain.importKey(privKey);
  cKeychain.importKey(privKey);
  const pAddressStrings = pchain.keyChain().getAddressStrings();
  const cAddressStrings = cchain.keyChain().getAddressStrings();
  const pChainBlockchainIdStr = Defaults.network[networkID].P.blockchainID;
  const avaxAssetID = Defaults.network[networkID].X.avaxAssetID;
  const cHexAddress = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
  const Web3 = require("web3");
  const path = "/ext/bc/C/rpc";
  const web3 = new Web3(`${protocol}://${ip}:${port}${path}`);
  const threshold = 1;
  const main = async () => {
    let balance = await web3.eth.getBalance(cHexAddress);
    balance = new BN(balance.toString().substring(0, 17));
    console.log(balance);
    const baseFeeResponse = await cchain.getBaseFee();
    const baseFee = new BN(parseInt(baseFeeResponse, 16));
    const txcount = await web3.eth.getTransactionCount(cHexAddress);
    const nonce = txcount;
    const locktime = new BN(0);
    let avaxAmount = new BN(1e7);
    let fee = baseFee.div(new BN(1e9));
    fee = fee.add(new BN(1e6));
    let unsignedTx = await cchain.buildExportTx(
      avaxAmount,
      avaxAssetID,
      pChainBlockchainIdStr,
      cHexAddress,
      cAddressStrings[0],
      pAddressStrings,
      nonce,
      locktime,
      threshold,
      fee,
    );
    const tx = unsignedTx.sign(cKeychain);
    const txid = await cchain.issueTx(tx);
    console.log(`Success! TXID: ${txid}`);
  };
  main();
}

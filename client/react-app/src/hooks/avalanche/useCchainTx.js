import { Avalanche, Buffer } from "../../src";
import { Tx } from "../../src/apis/evm";

export default function useCchainTx() {
  const ip = "api.avax.network";
  const port = 443;
  const protocol = "https";
  const networkID = 1;
  const avalanche = new Avalanche(ip, port, protocol, networkID);
  const cchain = avalanche.CChain();
  const main = async () => {
    const txID =
      "0xd46084ea0a4a86e761f939070355a169547ee483800726bf7b92cf0dfeb2358a";
    const hex = await cchain.getAtomicTx(txID);
    const buf = new Buffer(hex.slice(2), "hex");
    const tx = new Tx();
    tx.fromBuffer(buf);
    const jsonStr = JSON.stringify(tx);
    console.log(jsonStr);
    const jsn = JSON.parse(jsonStr);
    console.log(jsn);
  };
  main();
}

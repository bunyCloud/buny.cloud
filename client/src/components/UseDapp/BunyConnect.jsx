import React from "react";
import ReactDOM from "react-dom";
import {
  DAppProvider,
  useEtherBalance,
  useEthers,
  Config,
  Mainnet,
  Avalanche,
  AvalancheTestnet,
} from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { getDefaultProvider } from "ethers";

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  if (account) {
    return <button onClick={() => deactivate()}>Disconnect</button>;
  } else {
    return <button onClick={() => activateBrowserWallet()}>Connect</button>;
  }
};

function BunyConnect() {
  const { account, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);

  if (chainId && !config.readOnlyUrls[chainId]) {
    return (
      <p>
        Please use either Mainnet, Goerli testnet, Telos mainnet or Telos
        testnet.
      </p>
    );
  }

  return (
    <div>
      <ConnectButton />
      {etherBalance && (
        <div className="balance">
          <br />
          Address:
          <p className="bold">{account}</p>
          <br />
          Balance:
          <p className="bold">{formatEther(etherBalance)}</p>
        </div>
      )}
    </div>
  );
}
export default BunyConnect;

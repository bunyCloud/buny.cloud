import React from "react";
import { formatEther } from "@ethersproject/units";
import {
  useEtherBalance,
  useEthers,
} from "@usedapp/core";

const STAKING_CONTRACT = "0x00000000219ab540356cBB839Cbe05303d7705Fa";
const telosExplorerUrl = "https://teloscan.io";

export function UseDappCore() {
  const { account, activateBrowserWallet, deactivate, chainId } = useEthers();
  const userBalance = useEtherBalance(account);
  const stakingBalance = useEtherBalance(STAKING_CONTRACT);
  if (!config.readOnlyUrls[chainId]) {
    return (
      <p style={{ color: "white", fontSize: "12px" }}>
        Please use either Avalanche or Fuji testnet.
      </p>
    );
  }

  const ConnectButton = () => (
    <div>
      <button onClick={() => activateBrowserWallet()}>Connect</button>
      <p>Connect to wallet to interact with the example.</p>
    </div>
  );

  const MetamaskConnect = () => (
    <div>
      {account && (
        <div>
          <div className="inline">
            &nbsp;
            <div className="account">{account}</div>
          </div>
          <br />
        </div>
      )}
      {!account && <ConnectButton />}
      {account && <button onClick={deactivate}>Disconnect</button>}
      <br />
    </div>
  );

  return (
    <div>
      <MetamaskConnect />
      {userBalance && (
        <div className="balance">
          <br />
          Ether balance:
          <p className="bold">{formatEther(userBalance)} ETH</p>
        </div>
      )}
    </div>
  );
}

const bscExplorerUrl = 'https://bscscan.com'

export const BSC = {
  chainId: 56,
  chainName: 'Smart Chain',
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c',
  multicall2Address: '0xc50f4c1e81c873b2204d7eff7069ffec6fbe136d',
  rpcUrl: 'https://bsc-dataseed.binance.org	',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  blockExplorerUrl: bscExplorerUrl,
  //getExplorerAddressLink: getAddressLink(bscExplorerUrl),
  //getExplorerTransactionLink: getTransactionLink(bscExplorerUrl),
}

const bscTestnetExplorerUrl = 'https://testnet.bscscan.com'

export const BSCTestnet = {
  chainId: 97,
  chainName: 'Smart Chain Testnet',
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  blockExplorerUrl: bscTestnetExplorerUrl,
//  getExplorerAddressLink: getAddressLink(bscTestnetExplorerUrl),
//  getExplorerTransactionLink: getTransactionLink(bscTestnetExplorerUrl),
}



export const Telos = {
  chainId: 40,
  chainName: "Telos",
  isTestChain: false,
  isLocalChain: false,
  multicallAddress: "0xE1A34ca06e57f981A51C6a9518d1bCDAb3cE1c6d",
  rpcUrl: "https://mainnet.telos.net/evm",
  nativeCurrency: {
    name: "TLOS",
    symbol: "TLOS",
    decimals: 18,
  },
  blockExplorerUrl: telosExplorerUrl,
  // getExplorerAddressLink: getAddressLink(telosExplorerUrl),
  // getExplorerTransactionLink: getTransactionLink(telosExplorerUrl),
};

const telosTestnetExplorerUrl = "https://testnet.teloscan.io";

export const TelosTestnet = {
  chainId: 41,
  chainName: "Telos Testnet",
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: "0x39b0CF441E616e4e21a5f7b37c9CE0Ca750bd05B",
  rpcUrl: "https://mainnet.telos.net/evm",
  nativeCurrency: {
    name: "TLOS",
    symbol: "TLOS",
    decimals: 18,
  },
  blockExplorerUrl: telosTestnetExplorerUrl,
  //getExplorerAddressLink: getAddressLink(telosTestnetExplorerUrl),
  // getExplorerTransactionLink: getTransactionLink(telosTestnetExplorerUrl),
};

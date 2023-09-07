import { avatarAddress } from "contracts/config/networkAddress";
//Generic Wallet Key to make the call, not usable, DO NOT CHANGE.
export const key =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

//RPC Addresses, Change to any other if needed.
const eth = "https://rpc.ankr.com/eth";
const bsc = "https://bscrpc.com";
const poly = "https://matic-mainnet.chainstacklabs.com";
const ethkovan = "https://kovan.infura.io/v3/";
const ethrinkeby = "https://rinkeby.infura.io/v3/";
const ethropsten = "https://ropsten.infura.io/v3/";
const bsctest = "https://data-seed-prebsc-1-s3.binance.org:8545";
const polytest = "https://matic-mumbai.chainstacklabs.com";
const fuji = "https://api.avax-test.network/ext/bc/C/rpc";

const avalanche = "https://api.avax.network/ext/bc/C/rpc";

/*
█▀ █▀▀ ▀█▀ ▀█▀ █ █▄░█ █▀▀ █▀
▄█ ██▄ ░█░ ░█░ █ █░▀█ █▄█ ▄█
*/

/*
    Input the NFT Contract Address
    */
export const nftContract = avatarAddress;

export var network = avalanche;

export var displayAmount = 20;

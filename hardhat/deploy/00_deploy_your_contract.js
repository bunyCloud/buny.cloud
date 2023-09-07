

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Step0. Deploy sharedNFTLogic contract
  // Step1. Deploy erc721 with sharedlogic contract address
  // Step2. Deploy Token Factory with Token

  //// let static = ""; mumbai
  //// let dynamic = "0x10cA9E76Fb9d40B8Bc388A6986377669B46284f7"; //mumbai
  //// let sharednftlogic = "0x40C2748654Ee7949b22a8e3e56e42d176fac074E"; //mumbai
  //// let nftmarket = "0xD621C6c863Dd9A288Dc6B25d4024041E2281c272"; //mumbai
  // let _sharedNFTLogic = "0x529e79CB6B4808F98A377B8a8fee1Ce30983e379"; //rinkeby 
let _implementation = "0x2ca5ef3E63c91f5B7b013EE3ECf8EE6371BC5a1c"; //rinkeby
  //// let nftmarket = "0x3Fe8fB93Cff5D0ebA59861F69925c109D2Ed5a1a"; // polygon
  //// let sharednftlogic = "0x3616164Fdd8bd211814820C88Dca0F7457fD5E23"; //polygon
  //// let dynamic = "0x4353B7dB8a538D85d4945aA81669df9cAf9e0DDD"; //polygon
  //// let static = "0xeC288c0bDCc8B57025C487D023Fb04090e818075";

  //// let nftmarket = "0x5807574C534393dFD4094386b30C89fA2104baF2"; // fuji
  //let marketplaceAddress = "0x4d3A7251a7B5351067D00d17de3500dD722F416E";  //rinkeby
  //// let marketplaceAddress = "0x5807574C534393dFD4094386b30C89fA2104baF2"; //fuji
  //// let sharednftlogic = "0x10cA9E76Fb9d40B8Bc388A6986377669B46284f7"; //fuji
  // const dynamic = "0xBb3D452f166201d59eFC363A57fCBb749d704838"; // fuji
  //// let static = "0xfB01957930521a6a2d83dBC0311d08574A6F6b64"; //fuji
 
  // dFactory ERC721-S
  // Deploy Config
 //let _name = "The Buny";
 //let _symbol = "BUNY";
//// let baseURI = "https://buni.mypinata.cloud/ipfs/QmPif7uYfrKC9QhxPQmPbKzfZWAjpyAbBWQEGm8Y9cMzzT/"; //IPFS
//// let preSaleSigner = "0x8406A51A0E1B5F52Ff61226773e6328e5Da5d964"; //rinkeby
//// let freeSaleSigner = "0x8406A51A0E1B5F52Ff61226773e6328e5Da5d964"; //rinkeby
// let payees = ["0x8406A51A0E1B5F52Ff61226773e6328e5Da5d964","0x51249be9C4E483826ddA9cfc4093d1F021ea6204"];
// let shares = ["10","10"];
// let _cid = "QmPif7uYfrKC9QhxPQmPbKzfZWAjpyAbBWQEGm8Y9cMzzT/";
//Deploy 

  await deploy("dFactory", {
    from: deployer,
   args: [_implementation],
    log: true,
    waitConfirmations: 2,
  });

  const NFT = await ethers.getContract("dFactory", deployer);

};
module.exports.tags = ["dFactory"];

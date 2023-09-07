import Web3Modal from "web3modal";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Input, Space } from "antd";

// Import the ABI for the DiaOracle contract
const abi = [
  "function getTelosUSD() external returns (uint256)",
  "function getBTCUSD() external returns (uint256)",
  "function getETHUSD() external returns (uint256)",
  "function checkUSDAge(uint256 maxTimePassed) external view returns (bool)",
];

// Instantiate an ethers.js provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Instantiate a contract object with the DiaOracle address and ABI
const contractAddress = "0xB757391dF996f5B91E6e998D7986d4a592eb77Dc";
const diaOracleContract = new ethers.Contract(contractAddress, abi, provider);

function TelosTestnetOracle() {
  const [tlosUSD, setTlosUSD] = useState(0);
  const [btcUSD, setBtcUSD] = useState(0);
  const [ethUSD, setEthUSD] = useState(0);

  async function fetchCurrent() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://testnet.telos.net/evm",
      );
      const contract = new ethers.Contract(contractAddress, abi.abi, provider);
      try {
        const tlos = await contract.tlosUSD();
        const xtlos = new ethers.utils.formatEther(tlos, "ether");
        console.log("tlos: ", xtlos.toString());
        setTlosUSD(tlos);
        const btc = await contract.btcUSD();
        const xbtc = new ethers.utils.formatEther(btc, "ether");
        console.log(xbtc.toString());
        setBtcUSD(xbtc.toString());
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  useEffect(() => {
    fetchCurrent();
  }, []);

  // Define a function to get the Telos USD price from the contract
  const fetchTlosUsd = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const result = await contract.getTelosUSD();
    const format = new ethers.utils.formatEther(result, "ether");
    setTlosUSD(format.toString());
  };

  // Define a function to get the BTC USD price from the contract
  const getBTCUSD = async () => {
    const result = await diaOracleContract.getBTCUSD();
    setBtcUSD(result);
  };

  // Define a function to get the ETH USD price from the contract
  const getETHUSD = async () => {
    const result = await diaOracleContract.getETHUSD();
    setEthUSD(result);
  };

  // Define a function to check if the USD price is less than a certain age
  const checkUSDAge = async (maxTimePassed) => {
    const result = await diaOracleContract.checkUSDAge(maxTimePassed);
    return result;
  };

  return (
    <div>
      <Space>
        <Button onClick={fetchTlosUsd}>TLOS/USD</Button>
        <Input value={tlosUSD} disabled />
      </Space>
      <br />
      <Space>
        <Button onClick={getBTCUSD}>Get BTC USD</Button>
        <Input value={btcUSD} disabled />
      </Space>
      <br />
      <Space>
        <Button onClick={getETHUSD}>Get ETH USD</Button>
        <Input value={ethUSD} disabled />
      </Space>
      <br />
      <Button onClick={() => checkUSDAge(3600)}>Check USD Age</Button>
    </div>
  );
}

export default TelosTestnetOracle;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";
import RafflePage from "components/Layout/RafflePage";

function SelectProvider() {
  const [provider, setProvider] = useState(null);
  const { chainId, account } = useEthers();

  function refreshPage() {
    setTimeout(() => {
      window.location.reload();
    }, 100); // 5000 milliseconds = 5 seconds
  }

  useEffect(() => {
    async function connectToProvider() {
      // First, check if the user is already connected to a provider
      if (window.ethereum) {
        try {
          // Request access to the user's accounts
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Use the provider that the user is already connected to
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
        } catch (error) {
          console.error(error);
        }
      } else {
        // If the user is not connected to a provider, use the default provider
        const provider = new ethers.providers.JsonRpcProvider();
        setProvider(provider);
      }
    }

    connectToProvider();
  }, []);

  useEffect(() => {
    // Check the chain ID of the provider
    async function checkChainId() {
      if (provider) {
        const network = await provider.getNetwork();
        console.log(`Connected to network ${network.chainId}`);
        // Change the provider based on the chain ID
        if (network.chainId === 43114) {
          const newProvider = new ethers.providers.JsonRpcProvider(
            "https://api.avax.network/ext/bc/C/rpc",
          );
          setProvider(newProvider);
        } else if (network.chainId === 43113) {
          const newProvider = new ethers.providers.JsonRpcProvider(
            "fuji",
            "https://api.avax-test.network/ext/bc/C/rpc",
          );
          setProvider(newProvider);
        }
      }
    }

    checkChainId();
  }, [provider]);

  return (
    <div>
      <RafflePage provider={provider} refreshPage={refreshPage} />
    </div>
  );
}

export default SelectProvider;

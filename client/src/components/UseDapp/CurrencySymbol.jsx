import React, { useState, useEffect } from "react";

function CurrencySymbol({ chainId }) {
  const [symbol, setSymbol] = useState("Loading...");

  useEffect(() => {
    async function fetchSymbol() {
      const symbol = getCurrencySymbol(chainId);
      setSymbol(symbol);
    }
    fetchSymbol();
  }, [chainId]);

  return <span style={{fontSize:'12px', color:'black'}}>{symbol}</span>;
}

function getCurrencySymbol(chainId) {
  switch (chainId) {
    case 1:
      return "ETH";
    case 3:
      return "ETH";
      case 11155111:
        return "ETH";
    case 4:
      return "ETH";
    case 5:
      return "ETH";
    case 40:
      return "TLOS";
    case 41:
      return "TLOS";
    case 42:
      return "ETH";
    case 56:
      return "BNB";
    case 77:
      return "POA";
    case 97:
      return "BNB";
    case 99:
      return "POA";
    case 128:
      return "HT";
    case 137:
      return "MATIC";
    case 246:
      return "EWT";
    case 250:
      return "FTM";
      case 4002:
      return "FTM";
    case 42220:
      return "CELO";
    case 42161:
      return "ARB";
    case 43112:
      return "NEAR";
    case 43113:
      return "AVAX";
    case 43114:
      return "AVAX";
    case 44787:
      return "EDG";
    case 4689:
      return "STAKE";
    case 80001:
      return "MATIC";
    case 1666600000:
      return "ONE";
    case 1666600001:
      return "ONE";
    case 1666700000:
      return "GLMR";
    case 1666700001:
      return "GLMR";
    default:
      return "Unknown symbol";
  }
}

export default CurrencySymbol;

import { useEthers, useEtherBalance } from '@usedapp/core'
import { Button, Modal } from 'antd'
import { useState, useEffect } from 'react'




export default function NetworkName(){

   const { activateBrowserWallet, chainId,  } = useEthers()
   function getNetworkName(chainId) {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet'
      case 3:
        return 'Ropsten '
      case 4:
        return 'Rinkeby '
      case 5:
        return 'Goerli '
      case 40:
        return 'Telos'
      case 41:
        return 'Telos '

      case 42:
        return 'Kovan '
      case 56:
        return 'Binance Smart Chain Mainnet'
          case 97:
        return 'Binance Smart Chain '
      case 137:
        return 'Polygon'
      case 250:
        return 'Fantom'
        case 4002:
          return 'Fantom Testnet'
      case 42220:
        return 'Celo Mainnet'
      case 42161:
        return 'Arbitrum One'
      case 43113:
        return 'Fuji'
      case 80001:
        return 'Mumbai'
          case 43114:
        return 'Avalanche'
      case 43113:
        return 'Fuji'
      default:
        return 'Unknown network'
    }
  }
    const networkName = getNetworkName(chainId)

    


    return(
<>
<div> {networkName}</div>

</>
    )
}
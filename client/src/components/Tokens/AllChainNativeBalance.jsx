import { useState, useEffect } from 'react'
import { useEthers, useEtherBalance } from '@usedapp/core'
import {
  Mainnet,
  Avalanche,
  Polygon,
  Mumbai,
  AvalancheTestnet,
  Arbitrum,
  ArbitrumRinkeby,
  Optimism,
  OptimismKovan,
  Fantom,
  FantomTestnet,
} from '@usedapp/core'
import { getDefaultProvider } from 'ethers'
import { Telos, TelosTestnet, BSC, BSCTestnet } from '../UseDapp/UseDappCore'


import { ethers } from 'ethers'
import { Table } from 'antd'

const columns = [
  {
    title: 'Network',
    dataIndex: 'network',
    key: 'network',
  },
  {
    title: 'Token',
    dataIndex: 'token',
    key: 'token',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
  },
]

export default function AllChainNativeBalance() {
  const { account, chainId } = useEthers()
  const [ethBalance, setEthBalance] = useState('')
  const [maticBalance, setMaticBalance] = useState('')
  const [avaxBalance, setAvaxBalance] = useState('')
  const [optimismBalance, setOptimismBalance] = useState('')
  const [arbitrumBalance, setArbitrumBalance] = useState('')
  const [fantomBalance, setFantomBalance] = useState('')
  const [telosBalance, setTelosBalance] = useState('')



  const ethBalanceResult = useEtherBalance(account, { chainId: Mainnet.chainId })
  const maticBalanceResult = useEtherBalance(account, { chainId: Polygon.chainId })
   const avaxBalanceResult = useEtherBalance(account, { chainId: Avalanche.chainId })
   const optimismBalanceResult = useEtherBalance(account, { chainId: Optimism.chainId })
  const arbitrumBalanceResult = useEtherBalance(account, { chainId: Arbitrum.chainId })
  const fantomBalanceResult = useEtherBalance(account, { chainId: Fantom.chainId })
  const telosBalanceResult = useEtherBalance(account, { chainId: Telos.chainId })

  const data = [
    {
      key: '1',
      network: 'Ethereum',
      token: 'ETH',
      balance: ethBalance.substring(0,6)
    },
    {
      key: '2',
      network: 'Polygon',
      token: 'MATIC',
      balance: maticBalance.substring(0,6)
    },
    {
      key: '3',
      network: 'Avalanche',
      token: 'AVAX',
      balance: avaxBalance.substring(0,6),
    },
    {
      key: '4',
      network: 'Optimism',
      token: 'ETH',
      balance: optimismBalance.substring(0,6)
    },
    {
      key: '5',
      network: 'Arbitrum One',
      token: 'ETH',
      balance: arbitrumBalance.substring(0,6)
    },
    {
      key: '6',
      network: 'Fantom',
      token: 'FTM',
      balance: fantomBalance.substring(0,6)
    },
    {
      key: '7',
      network: 'Telos',
      token: 'TLOS',
      balance: telosBalance.substring(0,6)
    },
  ]

  useEffect(() => {
    if (ethBalanceResult) {
      setEthBalance(ethers.utils.formatEther(ethBalanceResult))
    }
    if (maticBalanceResult) {
      setMaticBalance(ethers.utils.formatEther(maticBalanceResult))
    }
    if (avaxBalanceResult) {
      setAvaxBalance(ethers.utils.formatEther(avaxBalanceResult))
    }
    if (optimismBalanceResult) {
      setOptimismBalance(ethers.utils.formatEther(optimismBalanceResult))
    }
    if (arbitrumBalanceResult) {
      setArbitrumBalance(ethers.utils.formatEther(arbitrumBalanceResult))
    }
    if (fantomBalanceResult) {
      setFantomBalance(ethers.utils.formatEther(fantomBalanceResult))
    }
    if (telosBalanceResult) {
      setTelosBalance(ethers.utils.formatEther(telosBalanceResult))
    }
  }, [
    ethBalanceResult,
    maticBalanceResult,
    avaxBalanceResult,
    optimismBalanceResult,
    arbitrumBalanceResult,
    fantomBalanceResult,
    telosBalanceResult,
  ])

  return (
    <>
      <Table columns={columns} dataSource={data} />
    </>
  )
}

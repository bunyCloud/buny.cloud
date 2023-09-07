import Web3Modal from 'web3modal'
import React, { useState, useEffect } from 'react'
import UseAnimations from 'react-useanimations'
import alertTriangle from 'react-useanimations/lib/alertTriangle'
import loading2 from 'react-useanimations/lib/loading2'
import {
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'
import {
  Box,
  Center,
  //Button,
  Text,
  VStack,
  Flex,
  Wrap,
  WrapItem,
  Heading,
} from '@chakra-ui/react'
import { Modal } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import raffleNft from 'contracts/sepolia/BunyRaffleNftV2.json'
//import { IconButton } from '@chakra-ui/react'
//import { CopyIcon } from '@chakra-ui/icons'
import { Image } from '@chakra-ui/react'
import { Tag } from 'antd-mobile'
import { notification, Popover } from 'antd'
import { useEthers } from '@usedapp/core'
import { HStack, useClipboard } from '@chakra-ui/react'
import { Button, List } from 'antd'
import { Result } from 'antd-mobile'
import CurrencySymbol from 'components/UseDapp/CurrencySymbol'
import HelpLayout from './RaffleHelpLayout'

function DynamicRafflePage(props) {
  const { provider } = props
  const { raffleAddress } = useParams()
  const { account, chainId } = useEthers()
  const [numberCanMint, setNumberCanMint] = useState()
  const [salesPrice, setSalesPrice] = useState()
  const [contractName, setContractName] = useState()
  const [description, setDescription] = useState()
  const [raffleOwner, setRaffleOwner] = useState()
  const [contractSymbol, setContractSymbol] = useState()
  const [totalSupply, setTotalSupply] = useState()
  const [thisImage, setImage] = useState()
  const [thisAnimation, setAnimation] = useState()
  const [thisPrize, setPrize] = useState()
  const [thisFee, setFee] = useState()
  const [loaded, setLoading] = useState()
  const navigate = useHistory()
  const [editionSize, setEditionSize] = useState()
  const { onCopy, hasCopied } = useClipboard(raffleAddress)
  const [minPlayers, setMinPlayers] = useState()
  const [maxTokens, setMaxTokens] = useState()
  const [potential, setPotential] = useState()
  const startRaffle = 'true'
  const [randomNumber, setRandomNumber] = useState()
  const [isActive, setIsActive] = useState()
  const [isProof, setIsProof] = useState()
  const [isComplete, setIsComplete] = useState()
  const [startTime, setStartTime] = useState()
  const [winnerSelected, setWinnerSelected] = useState()
  const [endTime, setEndTime] = useState()
  const [winningNumber, setWinningNumber] = useState()
  const [raffleWinner, setRaffleWinner] = useState()
  const [raffleComplete, setRaffleComplete] = useState('false')
  const [entries, setEntries] = useState([])
  const [entryCount, setEntryCount] = useState()
  const [thisSeed, setSeed] = useState()
  const [prime, setPrime] = useState()
  const [computeTime, setComputeTime] = useState()
  const [iterations, setIterations] = useState()
  const [newProof, setProof] = useState()
  const [newStart, setStart] = useState()
  const [computeTxLog, setComputeLog] = useState()
  const [supplyLog, setSupplyLog] = useState()
  const [connectedAddress, setConnectedAddress] = useState('')
  const [ownerSeed, setOwnerSeed] = useState()
  const [isOwner, setIsOwner] = useState(false)
  const { library } = useEthers()
  const [events, setEvents] = useState([])

  const getExplorerURL = () => {
    if (chainId === 1) {
      // Ethereum Mainnet
      return 'https://etherscan.io/'
    } else if (chainId === 43114) {
      // Avalanche Mainnet
      return 'https://snowtrace.io/'
    } else if (chainId === 43113) {
      // Avalanche Mainnet
      return 'https://testnet.snowtrace.io/'
    } else if (chainId === 137) {
      // Polygon Mainnet
      return 'https://polygonscan.com/'
    } else if (chainId === 40) {
      // Telos Mainnet
      return 'https://www.teloscan.io/'
    } else if (chainId === 4002) {
      // Telos Mainnet
      return 'https://testnet.ftmscan.com/'
    }
    return null
  }

  const explorerUrl = getExplorerURL()

  const bexmod = (base, exponent, modulus) => {
    let result = 1n
    for (; exponent > 0n; exponent >>= 1n) {
      if (exponent & 1n) {
        result = (result * base) % modulus
      }
      base = (base * base) % modulus
    }
    return result
  }
  const sloth = {
    compute(seed, prime, iterations) {
      const exponent = (prime + 1n) >> 2n
      let beacon = seed % prime
      for (let i = 0n; i < iterations; ++i) {
        beacon = bexmod(beacon, exponent, prime)
      }
      return beacon
    },
    verify(beacon, seed, prime, iterations) {
      for (let i = 0n; i < iterations; ++i) {
        beacon = (beacon * beacon) % prime
      }
      seed %= prime
      if (seed == beacon) return true
      if (prime - seed === beacon) return true
      return false
    },
  }

  const content = (
    <>
      <Box maxWidth={250}>
        <div style={{ fontSize: '10px' }}>
          <Text> Raffle: {description} </Text>
          <p>{raffleAddress}</p>
        </div>
        <div style={{ fontSize: '12px', color: 'purple', textAlign: 'center' }}>
          <p>
            Price per ticket: {salesPrice} / <CurrencySymbol chainId={chainId} />
          </p>
        </div>
      </Box>
    </>
  )

  const approveMinter = (
    <>
      <Box maxWidth={250}>
        <div style={{ fontSize: '10px' }}>{raffleAddress}</div>

        <p
          style={{
            fontSize: '12px',
            color: 'purple',
            backgroundColor: 'rgb(229 231 235)',
            textAlign: 'center',
          }}>
          Click to start raffle!
        </p>
      </Box>
    </>
  )
  //const provider = new ethers.providers.JsonRpcProvider('https://api.avax-.network/ext/bc/C/rpc')
  //const provider = new ethers.providers.Web3Provider(window.ethereum)

  const openNotification = () => {
    notification.open({
      message: 'Copied to clipboard',
      description: [
        <>
          <p style={{ fontSize: '10px' }}>Buny Raffle address {raffleAddress}</p>
        </>,
      ],
      onClick: () => {
        console.log('Notification Clicked!')
      },
    })
  }
  const [tx1, setTx1] = useState()

  async function fetchRaffle() {
    setLoading(true)
    const contract = new ethers.Contract(raffleAddress, raffleNft.abi, props.provider)
    const name = await contract.name() //contract name
    setContractName(name)
    const symbol = await contract.symbol()
    setContractSymbol(symbol)
    const size = await contract.editionSize()
    setEditionSize(size.toString())
    setWinningNumber(size.toString())
    const avail = await contract.numberCanMint()
    setNumberCanMint(avail.toString())
    setSupplyLog(`${avail} Ticket(s) still available`)
    //const raffle = await contract.houseFee()
    //const fee = ethers.utils.formatEther(raffle.toString())
    //setFee(Number(fee).toString())
    const prize = await contract.getPrize()
    const avaxPrize = ethers.utils.formatEther(prize.toString())
    setPrize(Number(avaxPrize))
    const image = await contract.imageUrl()
    setImage(image)
    const animation = await contract.animationUrl()
    setAnimation(animation)
    const desc = await contract.description()
    setDescription(desc)
    const startTime = await contract.startTime()
    const date = new Date(startTime * 1000)
    setStartTime(date.toUTCString())
    const isActive = await contract.active()
    setIsActive(Boolean(isActive))
    const isComplete = await contract.isComplete()
    setIsComplete(Boolean(isComplete))
    const mplayers = await contract.minPlayers()
    setMinPlayers(mplayers.toString())
    const mtokens = await contract.maxTokens()
    setMaxTokens(mtokens.toString())
    const supply = await contract.totalSupply()
    setTotalSupply(supply.toString())
    const owner = await contract.owner() // fetch owner
    setRaffleOwner(owner)
    const weiprice = await contract.salePrice()
    const price = ethers.utils.formatEther(weiprice, 'ether')
    setSalesPrice(price)
    const findPotential = ((size * weiprice) / 100) * 90
    console.log(findPotential.toString())
    const formatIt = ethers.utils.formatEther(findPotential.toString())
    setPotential(formatIt)
    console.log(formatIt)
    const rn = await contract.randomNumber()
    setRandomNumber(rn.toString())
    console.log(`Provable random number confirmed..? ${rn.toString()}`)
    const ip = await contract.isProof()
    setIsProof(Boolean(ip.toString()))
    console.log(`Provable random number = ${ip.toString()}`)
    const winSelected = await contract.winnerSelected()
    setWinnerSelected(Boolean(winSelected))
    console.log(`Winner selected?: ${winSelected}`)
    if (winSelected === true) {
      const winNumber = await contract.winningNumber()
      setWinningNumber(winNumber.toString())
      const winnerAddress = await contract.Winner()
      setRaffleWinner(winnerAddress.toString())
      console.log(`Raffle complete! Winner Selected! ${winnerAddress}, token Id:${winNumber}`)
      const rend = await contract.endTime()
      const edate = new Date(rend * 1000)
      setEndTime(edate.toUTCString())
    }
    setLoading(false)
  }
  const [purchaseEvents, setPurchaseEvents] = useState()

  async function mintToken() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(raffleAddress, raffleNft.abi, signer)
      const data = await contract.salePrice()
      console.log(data)
      const transaction = await contract.purchase({
        value: data,
      })
      const tx = await provider.getTransaction(transaction.hash)
      if (tx) {
        if (tx.blockNumber) {
          console.log('tx: ')
          console.log(tx)
          return tx
        }
        refreshPage()
      }
      setTx1('Minting NFT Ticket please wait....', tx)
      setTx1(transaction.hash)
      setTx1(`Transaction complete.......`)
      setTx1(null)
    } else {
      console.log('Contract not found')
    }
  }

  function refreshPage() {
    setTimeout(() => {
      window.location.reload()
    }, 2000) // 5000 milliseconds = 5 seconds
  }

  async function approveRaffle() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(raffleAddress, raffleNft.abi, signer)
    const transaction = await contract.setApprovedMinter(raffleAddress, startRaffle)
    await transaction.wait()
    const startTime = await contract.startTime()
    setStartTime(startTime.toString())
    refreshPage()
  }

  const [winnerTx, setWinnerTx] = useState()

  async function randomRaffleWinner() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(raffleAddress, raffleNft.abi, signer)
    const transaction = await contract.pickWinner()
    await transaction.wait()
    const tx = await provider.getTransaction(transaction.hash)
    if (tx) {
      if (tx.blockNumber) {
        console.log('tx: ')
        console.log(tx)
        return tx
      }
      console.log(`Block explorer transaction hash ${explorerUrl}tx/${transaction.hash}`)
      setWinnerTx(`${explorerUrl}tx/${transaction.hash}`)
      setTx1('Starting transaction.....', tx)
      refreshPage()
    }
  }

  function getNetworkSymbol(chainId) {
    switch (chainId) {
      case 1:
        return 'ETH'
      case 5:
        return 'ETH '
      case 40:
        return 'TLOS'
      case 41:
        return 'TLOS'
      case 137:
        return 'MATIC'
      case 43114:
        return 'Avalanche'
      case 43113:
        return 'AVAX '
      case 43113:
        return 'AVAX '
      case 80001:
        return 'MATIC '
      case 4002:
        return 'FTM'

      default:
        return 'Unknown network'
    }
  }

  const networkSymbol = getNetworkSymbol(chainId)

  useEffect(() => {
    fetchRaffle()
  }, [])

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function main() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(raffleAddress, raffleNft.abi, signer)
      const prime = BigInt((await contract.prime()).toString())
      const iterations = BigInt((await contract.iterations()).toNumber())
      console.log('prime', prime.toString())
      setPrime(prime.toString())
      console.log('iterations', iterations.toString())
      setIterations(iterations.toString())
      const seed = BigInt((await contract.seed(account)).toString())
      console.log('seed', seed.toString())
      console.log('Connected player seed discovered...')
      setSeed(seed.toString())
      const start = Date.now()
      const date = new Date(start * 1000)
      console.log('Begin compute proof verification process....')
      console.log('Start time:', date.toUTCString())
      setStart(date.toUTCString())
      const proof = sloth.compute(seed, prime, iterations)
      console.log(`Player seed successfully computed. Provable random number generating. ${proof}`)
      setProof(proof.toString())
      setComputeTime(Date.now() - start, proof)
      console.log('compute time', Date.now() - start, 'ms', 'vdf proof', proof)
      const proofTx = await contract.prove(proof)
      console.log('Proof Tx', proofTx.toString())
      await proofTx.wait()
      setComputeLog(proofTx.hash)
      console.log(proofTx.hash)
      if (proofTx) {
        randomRaffleWinner()
        console.log('Generating random winner.....getting transaction results')
      }
    } else {
      console.log('ERROR: no proof found or unable to compute. Please try again or contact the rabbit help desk')
    }
  }

  async function fetchEntries() {
    setLoading(true)
    const contract = new ethers.Contract(raffleAddress, raffleNft.abi, props.provider)

    const count = await contract.EntryCount()
    setEntryCount(count.toString())
    console.log(count.toString())
    const items = []
    console.log(items)
    try {
      for (let i = 0; i < count; i++) {
        const items = await contract.readAllEntries()
        setEntries(items)
        console.log(items)
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  useEffect(() => {
    async function getConnectedAddress() {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Connect to the Ethereum network
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        // Get the connected address
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })
        setConnectedAddress(accounts[0])
      }
    }
    getConnectedAddress()
  }, [])

  useEffect(() => {
    async function checkOwnerWinner() {
      // Create an ethers.js provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // Create an instance of the token contract
      const contract = new ethers.Contract(raffleAddress, raffleNft.abi, provider)
      // Get the owner of the token
      const tokenOwner = await contract.ownerOf(winningNumber)
      // Check if the connected address is the owner of the token
      setIsOwner(tokenOwner === raffleWinner)
    }
    if (connectedAddress) {
      checkOwnerWinner()
    }
  }, [connectedAddress, raffleAddress, winningNumber, raffleWinner])

  useEffect(() => {
    async function checkOwnerSeed() {
      // Create an ethers.js provider

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // Create an instance of the token contract
      const contract = new ethers.Contract(raffleAddress, raffleNft.abi, provider)
      // Get the owner of the token
      const ownerSeed = await contract.seed(connectedAddress)
      // Check if the connected address is the owner of the token
      setOwnerSeed(ownerSeed)
      console.log(`Connected player seed: ${ownerSeed.toString()}`)
      console.log('All player addresses have unique seed generated.')
    }
    if (connectedAddress) {
      checkOwnerSeed()
    }
  }, [connectedAddress, raffleAddress])

  return (
    <>
      <Wrap bg="white" justify="center" border={'6px solid #9dcfb4'} w="100%" maxWidth={900}>
        <WrapItem justify="center" w={'100%'} maxWidth={360}>
          <Center w="100%">
            <VStack>
              <Box bg="white">
                <Center>
                  <HStack mb={5} mt={-2}>
                    <h3 style={{ color: '#514d5b', marginRight: '5px' }}>{contractName}</h3>

                    <TwitterShareButton
                      title={`${contractName} Win ${potential}/${networkSymbol} Ticket: ${salesPrice} / ${networkSymbol}`}
                      via={'buny_raffle'}
                      url={`https://buny.cloud/raffle/${raffleAddress}`}
                      hashtags={[`${networkSymbol}`, 'BunyRaffle', 'NftCommunity']}>
                      <TwitterIcon size={20} round />
                    </TwitterShareButton>
                    <RedditShareButton url={`${contractName} https://buny.cloud/raffle/${raffleAddress}`}>
                      <RedditIcon size={20} round />
                    </RedditShareButton>
                    <TelegramShareButton
                      url={`${contractName} Win ${potential} |
 https://buny.cloud/raffle/${raffleAddress}`}>
                      <TelegramIcon size={20} round />
                    </TelegramShareButton>
                  </HStack>
                </Center>
                <Box
                  fontWeight="bold"
                  //color="#fe9d97"
                  h={'auto'}
                  p={8}
                  fontSize="10px"
                  w={'100%'}
                  bg="#bbdccb"
                  lineHeight="tight"
                  noOfLines={[1]}
                  isTruncated>
                  <HStack>
                    <div
                      onClick={openNotification}
                      style={{
                        fontSize: '12px',
                        padding: '0px',
                        textAlign: 'left',
                        color: 'black',
                      }}>
                      <strong style={{ paddingRight: '4px', paddingLeft: '4px' }}>Address:</strong>
                      <a href={`${explorerUrl}address/${raffleAddress}`} target="_blank" rel="noreferrer">
                        {raffleAddress}
                      </a>
                      {/*
                        <Tooltip title="Copy to clipboard">
                          <IconButton
                            m={2}
                            onClick={onCopy}
                            variant="outline"
                            colorScheme="teal"
                            aria-label="Copy to clipboard"
                            icon={<CopyIcon />}>
                            {hasCopied ? 'Copied!' : 'Copy'}
                          </IconButton>
                        </Tooltip>
                        */}
                    </div>
                  </HStack>
                  <div
                    style={{
                      fontSize: '12px',
                      padding: '0px',
                      textAlign: 'left',
                      color: 'black',
                    }}>
                    <strong style={{ paddingRight: '4px', paddingLeft: '4px' }}>Owner:</strong>
                    <a href={`${explorerUrl}${raffleOwner}`} target="_blank" rel="noreferrer">
                      {raffleOwner}
                    </a>
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      padding: '0px',
                      textAlign: 'left',
                      color: 'black',
                    }}>
                    <HStack gap={6} mb={5}>
                      {' '}
                      <div style={{ paddingRight: '4px', paddingLeft: '4px' }}>Symbol: {contractSymbol}</div>
                      <div style={{ paddingRight: '4px', paddingLeft: '4px' }}>Min. Players: {minPlayers}</div>
                      <div style={{ paddingRight: '4px', paddingLeft: '4px' }}>
                        <HStack>
                          <div> Ticket: {salesPrice}</div> <div>{networkSymbol}</div>
                        </HStack>
                      </div>
                    </HStack>
                    <div style={{ paddingRight: '4px', paddingLeft: '4px' }}>
                      {isActive && <>Start Time: {startTime}</>}
                    </div>
                  </div>
                </Box>
              </Box>
              <Box
                //border={"3px solid #d5e5e2"}
                h="100%"
                style={{
                  //margin: "10px",
                  color: 'white',
                }}>
                <Tag float="left">NFT Image</Tag>

                <model-viewer
                  shadow-intensity="1"
                  style={{
                    width: '360px',
                    height: '360px',

                    padding: '10px',
                    backgroundColor: 'white',
                  }}
                  camera-controls
                  poster={thisImage}
                  //alt={`Nft Name: ${nft.name}`}
                  src={thisAnimation}></model-viewer>

                <Box fontSize="12px" w="100%" maxWidth="360px" p={5} h="100%" bg="#fefce2" color="black">
                  <Tag float="left">Description</Tag>
                  <Text>{description}</Text>
                  <Center>
                    {loaded && (
                      <>
                        <UseAnimations animation={loading2} size={56} />
                      </>
                    )}
                  </Center>
                </Box>
              </Box>
            </VStack>
          </Center>
        </WrapItem>
        <WrapItem w={360}>
          <Box
            border={'2px solid #d5e5e2'}
            //mt={10}
            bg="white"
            w={'360px'}
            h={'100%'}
            style={{
              fontSize: '12px',
              color: 'white',
            }}>
            <VStack bg="white">
              <div>
                {!raffleWinner && (
                  <>
                    <Box w="auto" h="100%" p={10} mb="-5px">
                      <Center>
                        <VStack>
                          <div>
                            {thisImage && (
                              <>
                                <Center>
                                  <Image src={thisImage} width="75px" alt="Buny 2023 Carrot Award" />
                                </Center>
                              </>
                            )}
                          </div>
                          <Tag color="black" fill="outline" style={{ '-background-color': '#bbdccb' }}>
                            <div
                              style={{
                                fontSize: '18px',
                                //color: '#bbdccb',
                                textAlign: 'center',
                                width: 'auto',
                              }}>
                              <HStack>
                                <div> Win {potential} |</div> <div>{networkSymbol}</div>
                              </HStack>
                            </div>
                          </Tag>

                          <div>
                            {!raffleWinner && (
                              <>
                                <Center>
                                  <VStack>
                                    <Tag
                                      color="black"
                                      fill="outline"
                                      style={{
                                        '--background-color': '#bbdccb',
                                      }}>
                                      <div
                                        style={{
                                          fontSize: '12px',
                                          //color: '#bbdccb',
                                          textAlign: 'center',
                                          width: 'auto',
                                        }}>
                                        Tickets Sold: {totalSupply} of {editionSize}
                                      </div>
                                    </Tag>
                                    <Tag
                                      color="black"
                                      fill="outline"
                                      style={{
                                        '--background-color': '#bbdccb',
                                      }}>
                                      <div
                                        style={{
                                          fontSize: '12px',
                                          //color: '#bbdccb',
                                          textAlign: 'center',
                                          width: 'auto',
                                        }}>
                                        {supplyLog}
                                      </div>
                                    </Tag>
                                  </VStack>
                                </Center>
                              </>
                            )}
                          </div>
                        </VStack>
                      </Center>
                    </Box>
                  </>
                )}
                <Center>
                  {loaded && (
                    <>
                      <UseAnimations animation={loading2} size={56} />
                    </>
                  )}
                </Center>
                <div>
                  {isActive && startTime && !isComplete && (
                    <>
                      <VStack>
                        <Popover content={content} title={contractName}>
                          <Button
                            type="primary"
                            style={{
                              marginTop: '10px',
                              width: '300px',
                              fontSize: '18px',
                            }}
                            onClick={mintToken}>
                            <Center>
                              <HStack>
                                <div>Buy Ticket</div>
                                <div> {salesPrice} </div>
                                <div>{networkSymbol}</div>
                              </HStack>
                            </Center>
                          </Button>
                        </Popover>
                        <Center>
                          <div
                            style={{
                              color: '#54b9b5',
                              fontSize: '14px',
                            }}>
                            {maxTokens && !isComplete && (
                              <>
                                {' '}
                                <Text color="black" fill="outline" style={{ '-background-color': '#bbdccb' }}>
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      //color: '#bbdccb',
                                      textAlign: 'center',
                                      backgroundColor: '#fefce2',
                                      width: '300px',
                                    }}>
                                    Max Tickets per Wallet: {maxTokens}
                                  </div>
                                </Text>{' '}
                              </>
                            )}
                          </div>
                        </Center>
                        <Box color="black">{tx1}</Box>
                        <Box color="black">{winnerTx}</Box>
                      </VStack>
                    </>
                  )}
                </div>
              </div>
              <div>
                {winnerSelected && (
                  <>
                    <Box fontSize="16px" bg="#fdeeb3" color="black" p={8} mt={5} mb={5}>
                      <Heading as="h3"> Congratulations Raffle Winner!</Heading>
                      <div>
                        <Box w="auto">
                          <Center>
                            <VStack>
                              <div>{raffleWinner && <>{raffleWinner}</>}</div>
                              <div>{winningNumber && <>Ticket #:{winningNumber}</>}</div>
                              <div>Completed: {endTime}</div>
                            </VStack>
                          </Center>
                        </Box>
                      </div>
                    </Box>
                  </>
                )}
              </div>
            </VStack>
            <div>
              {!isActive && !isComplete && (
                <>
                  <Box w="100%" bg="#eda9fc" color="black" p={10}>
                    <Text style={{ padding: '5px' }}>
                      You have arrived!! Welcome to the experimental multi chain blockchain NFT raffle rabbit hole -
                      "Buny Raffle". We are happy you could make it!{' '}
                    </Text>
                  </Box>
                </>
              )}
            </div>
            <div>
              <Center>
                {!isComplete && !isActive && (
                  <>
                    <Box w="100%" bg="white" color="black" p={10}>
                      <Result title={'Raffle has not started'} />
                      <Center>
                        <HStack>
                          <UseAnimations animation={alertTriangle} size={56} />
                          <Text>
                            <Text>Owner approval required</Text>
                          </Text>
                          <Popover content={approveMinter} title="Set Approved Minter">
                            <Button type="primary" onClick={approveRaffle} margin={5} size={'xs'} p={4} float="right">
                              Approve
                            </Button>
                          </Popover>
                        </HStack>
                      </Center>
                    </Box>
                  </>
                )}
              </Center>
            </div>
            <Box color="black">
              <div>
                {iterations && (
                  <>
                    <Box w={360} h="40px" wordBreak={'break-all'}>
                      Seed:{thisSeed}
                    </Box>
                    <div>Start: {newStart}</div>
                    <div>Proof: {newProof}</div>
                    <div>Compute time: {computeTime} /ms</div>
                    <div>
                      {computeTxLog && (
                        <>
                          <a target="_blank" href={`${explorerUrl}tx/${computeTxLog}`} rel="noreferrer">
                            View Transaction on Block Explorer
                          </a>
                        </>
                      )}
                    </div>
                    <div>
                      {winnerTx &
                      (
                        <>
                          <a href={`${explorerUrl}`} target="_blank" rel="noreferrer">
                            {winnerTx}
                          </a>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div>
                {isComplete && !winnerSelected && (
                  <>
                    <Box w="auto" bg="#f6ccd0" p={4} mb={10}>
                      <Box>
                        <Center>
                          <Heading as={'h5'}>Raffle NFTs Sold Out!</Heading>
                        </Center>

                        <Text fontSize="14px" p={5}>
                          Any player may start the raffle drawing process by clicking the "Start Random Drawing" button
                          below.{' '}
                        </Text>
                        <Button type="primary" block onClick={main}>
                          Start Random Drawing
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
              </div>
            </Box>

            <div>
              {!winnerSelected && (
                <>
                  <Box
                    w={'100%'}
                    h={333}
                    overflowX="hidden"
                    overflowWrap="anywhere"
                    style={{
                      fontSize: '10px',
                      //padding: '10px',
                      color: 'white',
                    }}>
                    <Flex bg="#bbdccb" h="100%">
                      <VStack>
                        <Tag float="left">Players</Tag>
                        <Center>
                          <div>
                            <List
                              style={{
                                width: '360px',

                                fontSize: '10px',
                              }}
                              grid={{
                                gutter: 4,
                                column: 1,
                              }}
                              dataSource={entries}
                              renderItem={(item) => (
                                <List.Item key={item.EntryNumber}>
                                  <List.Item.Meta
                                    title={
                                      <>
                                        <HStack gap={0}>
                                          <div style={{ fontSize: '12px' }}>
                                            <Button
                                              size="small"
                                              onClick={() => {
                                                Modal.alert({
                                                  //image: 'https://buny.us-southeast-1.linodeobjects.com/CARROT2.png',
                                                  title: 'NFT Ticket Minted!',
                                                  confirmText: 'Confirm',
                                                  content: [
                                                    <>
                                                      <Text>Successfully minted ticket</Text>
                                                      <Box w={300}>
                                                        <div>Token Id:{item.EntryNumber.toString()}</div>
                                                        <div>NFT:{contractName}</div>
                                                        <div>Symbol: {contractSymbol}</div>
                                                        <Center>
                                                          <Image src={thisImage} w={200} h={200} />
                                                        </Center>
                                                      </Box>
                                                    </>,
                                                  ],
                                                })
                                              }}>
                                              Ticket #: {item.EntryNumber.toString()}
                                            </Button>
                                          </div>
                                          <div style={{ fontSize: '12px' }}>
                                            {item.player &&
                                              `${item.player.slice(0, 4)}...${item.player.slice(
                                                item.player.length - 4,
                                                item.player.length
                                              )}`}
                                          </div>
                                          <div style={{ fontSize: '12px' }}>{item.entry}</div>
                                          <Text>
                                            <div style={{ fontSize: '12px' }}>
                                              {new Date(item.entryTime * 1000).toUTCString()}
                                            </div>
                                          </Text>
                                        </HStack>
                                      </>
                                    }
                                  />
                                </List.Item>
                              )}
                            />
                          </div>
                        </Center>
                      </VStack>
                    </Flex>
                  </Box>
                </>
              )}
            </div>
            <Button
              width="100%"
              block
              style={{ marginTop: '10px' }}
              type="link"
              onClick={() => {
                Modal.alert({
                  //image: 'https://buny.us-southeast-1.linodeobjects.com/CARROT2.png',
                  title: 'Disclaimer',
                  confirmText: 'Confirm',
                  content:
                    'THIS SOFTWARE IS EXPERIMENTAL AND PROVIDED "AS IS" ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.',
                })
              }}>
              Disclaimer
            </Button>
          </Box>
        </WrapItem>
      </Wrap>
    </>
  )
}

export default DynamicRafflePage

import React, { useState, useEffect } from 'react'
import { Box, Center, HStack, Link, VStack, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useEthers } from '@usedapp/core'
import raffleFactory from 'contracts/sepolia/BunyRaffleFactory.json'
import { ImageUpload } from 'react-ipfs-uploader'
import { Input, Tag, Button, Result } from 'antd'
import {
  TelosTestnetRaffleFactoryAddress,
  TelosRaffleFactoryAddress,
  MumbaiRaffleFactoryAddress,
  avalancheRaffleFactoryAddress,
  FantomTestnetRaffleFactoryAddress,
  SepoliaRaffleFactoryAddress,
} from '../../contracts/config/networkAddress'
import { Switch } from 'antd'
import { FujiRaffleFactoryAddress } from './../../contracts/config/networkAddress'
import ConnectButtonBeta from 'components/UseDapp/ConnectButtonBeta'

function DynamicRaffleFactory(props) {
  const [thisInit, setInitiate] = useState()
  const [thisDeploy, setDeploy] = useState()
  const { account, chainId, switchNetwork } = useEthers()
  const [editionSize, setRaffleSize] = useState()
  const [ticketCount, setTicketCount] = useState()
  const [ticketPrice, setTicketPrice] = useState()
  const [thisDescription, setDescription] = useState()
  const [file, setFile] = useState()
  const [minPlayers, setMinPlayers] = useState()
  const [maxTokens, setMaxTokens] = useState()
  const { TextArea } = Input
  const [raffleUrl, setRaffleUrl] = useState()
  const [network, setNetwork] = useState()
  const [contractAddress, setContractAddress] = useState('')

  function raffleAddress(chainId) {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet'

      case 4002: //Fantom Testnet
        return FantomTestnetRaffleFactoryAddress
      case 41: // Telos Testnet
        return TelosTestnetRaffleFactoryAddress
      case 11155111: // Sepolia
        return SepoliaRaffleFactoryAddress
      case 43113: // Fuji Testnet
        return FujiRaffleFactoryAddress
      case 43113: //Avax Mainnet
        return avalancheRaffleFactoryAddress
      case 40: // Telos Mainnet
        return TelosRaffleFactoryAddress
      case 80001: // Mumbai Testnet
        return MumbaiRaffleFactoryAddress
      case 4002:
        return FantomTestnetRaffleFactoryAddress
      default:
        return 'Unknown network'
    }
  }

  const handleNetworkChange = (checked) => {
    if (checked) {
      setNetwork('mainnet')
    } else {
      setNetwork('testnet')
    }
    setContractAddress('') // reset the contract address when network is changed
  }

  const [raffleChain, setRaffleChain] = useState()
  const [raffleNetwork, setRaffleNetwork] = useState()
  function handleChange(event) {
    const selectedOption = event.target.selectedOptions[0]
    const chain = selectedOption.dataset.chainid
    const network = selectedOption.dataset.network
    if (chain) {
      // Update the React state with the selected chainId and option value
      setContractAddress(selectedOption.value)
      setRaffleChain(chain)

      setRaffleNetwork(network)
    }
  }

  const handleRaffleChain = (event) => {
    setRaffleChain(event.target.value)
  }

  async function createThisRaffle(chainId) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    // Get the connected chain ID
    //   const chainId = await provider.getNetwork().then((network) => network.chainId)
    // Check if chainId matches aChain

    if (!chainId == raffleChain) {
      alert(`Please switch to the correct network (Chain ID ${raffleChain})`)
      return
    }
    const signer = provider.getSigner()
    // Mint NFT token
    const contract = new ethers.Contract(contractAddress, raffleFactory.abi, signer)
    const units = ethers.utils.parseUnits(ticketPrice)
    const transaction = await contract.createEdition(thisDescription, file, ticketCount, units, minPlayers, maxTokens)
    const tx = await provider.getTransaction(transaction.hash)
    if (tx) {
      if (tx.blockNumber) {
        console.log('tx: ')
        console.log(tx)
        return tx
      }
      refreshPage()
    }
    setInitiate('Deploying NFT Raffle..', tx)
  }

  return (
    <>
      <Box
        bg="transparent"
        //border={"1px solid blue"}
        //mt={42
        //p={5}
        isTruncated
        w={'100%'}
        mt={6}
        //maxWidth={300}
        style={{
          fontSize: '12px',

          color: 'white',
          //padding:'2px',
        }}>
        <h4 style={{ color: '#514d5b' }}>Create Buny NFT Raffle</h4>

        <Center>
          <VStack bg="#fefce2" w="100%" mt={4}>
            <ConnectButtonBeta />
            <Text color="black" fontSize="12px">
              Select a network to deploy your raffle:
            </Text>
            <div style={{ color: 'black' }}>
              <span>Testnet:</span>
              <Switch checked={network === 'mainnet'} onChange={handleNetworkChange} />
              <span>Mainnet</span>
              {network === 'mainnet' ? (
                <div style={{ color: 'black' }}>
                  <select id="contract-select" value={contractAddress} onChange={handleChange}>
                    <option value="">--Select network--</option>
                    <option value={avalancheRaffleFactoryAddress} data-chainid="43114" data-network="Avalanche">
                      Avalanche Mainnet
                    </option>
                    <option value={TelosRaffleFactoryAddress} data-chainid="40" data-network="Telos">
                      Telos Mainnet
                    </option>
                  </select>
                </div>
              ) : (
                <div style={{ color: 'black' }}>
                  <select id="contract-select" value={contractAddress} onChange={handleChange}>
                    <option value="">--Select network--</option>
                    <option value={SepoliaRaffleFactoryAddress} data-chainid="11155111" data-network="Sepolia Testnet">
                      Sepolia Testnet
                    </option>
                    <option value={FujiRaffleFactoryAddress} data-chainid="43113" data-network="Fuji Testnet">
                      Fuji Testnet
                    </option>
                    <option value={TelosTestnetRaffleFactoryAddress} data-chainid="41" data-network="Telos Testnet">
                      Telos Testnet{' '}
                    </option>
                    <option value={MumbaiRaffleFactoryAddress} data-chainid="80001" data-network="Mumbai Testnet">
                      Mumbai Testnet
                    </option>
                    <option
                      value={FantomTestnetRaffleFactoryAddress}
                      data-chainid="43113"
                      data-network="Fantom Testnet">
                      Fantom Testnet{' '}
                    </option>
                  </select>
                </div>
              )}
            </div>
          </VStack>
        </Center>
        <div>
          {raffleNetwork && (
            <>
              <Box mt={2} bg="#9dcfb4">
                <Center>
                  <VStack spacing={2}>
                    <HStack mb={-5} h={44}>
                      <Text as="h6" mt={8} color="#514d5b">
                        Network Selected:
                      </Text>
                      <VStack>
                        <Tag color="orange">
                          <HStack>
                            <div style={{ fontSize: '12px' }}>{raffleNetwork}</div>
                            <div style={{ fontSize: '12px' }}>{raffleChain}</div>
                          </HStack>
                        </Tag>
                      </VStack>
                    </HStack>
                  </VStack>
                </Center>
              </Box>
            </>
          )}
        </div>
        <Box mt={2}>
          <VStack>
            <Box mb={-4}>
              <Box width="auto" padding="4px" bg="#fefce2" color="black">
                <div>
                  <p style={{ padding: '5px' }}>
                    <strong>Description:</strong>
                  </p>
                </div>
                <TextArea
                  placeholder="Description of NFT Raffle"
                  rows={4}
                  style={{
                    //padding: 5,
                    width: '300px',
                    color: 'black',
                    fontSize: 12,
                  }}
                  onChange={(e) => {
                    setDescription(e.target.value)
                  }}
                  value={thisDescription}
                />
              </Box>

              <Box width="100%" padding="2px" bg="#fefce2" color="black">
                <HStack>
                  <div>
                    <p style={{ padding: '5px' }}>
                      <strong># of Tickets:</strong>
                    </p>
                  </div>
                  <Input
                    placeholder="Ticket count"
                    onChange={(e) => {
                      setTicketCount(e.target.value)
                    }}
                    value={ticketCount}
                    style={{
                      padding: 5,
                      marginBottom: '4px',
                      width: '100%',

                      color: 'black',
                      fontSize: 12,
                    }}
                  />
                </HStack>
              </Box>

              <Box width="100%" padding="2px" bg="#fefce2" color="black">
                <HStack>
                  <div>
                    <p style={{ padding: '5px' }}>
                      <strong>Ticket Price:</strong>
                    </p>
                  </div>
                  <Input
                    placeholder="Ticket Price"
                    onChange={(e) => {
                      setTicketPrice(e.target.value)
                    }}
                    value={ticketPrice}
                    style={{
                      padding: 5,
                      marginBottom: '4px',
                      width: '100%',

                      color: 'black',
                      fontSize: 12,
                    }}
                  />
                </HStack>
              </Box>

              <Box width="100%" padding="2px" bg="#fefce2" color="black">
                <HStack>
                  <div>
                    <p style={{ padding: '5px' }}>
                      <strong>Min. Players</strong>
                    </p>
                  </div>
                  <Input
                    placeholder="Min. players"
                    onChange={(e) => {
                      setMinPlayers(e.target.value)
                    }}
                    value={minPlayers}
                    style={{
                      padding: 5,
                      marginBottom: '4px',
                      width: '100%',

                      color: 'black',
                      fontSize: 12,
                    }}
                  />
                </HStack>
                <p style={{ fontSize: '9px' }}>*Min. Players to complete raffle</p>
              </Box>

              <Box width="100%" padding="2px" bg="#fefce2" color="black">
                <HStack>
                  <div>
                    <p style={{ padding: '5px' }}>
                      <strong>Max. Tickets</strong>
                    </p>
                  </div>
                  <Input
                    placeholder="Max Tickets per Wallet"
                    onChange={(e) => {
                      setMaxTokens(e.target.value)
                    }}
                    value={maxTokens}
                    style={{
                      padding: 5,
                      marginBottom: '4px',
                      width: '100%',

                      color: 'black',
                      fontSize: 12,
                    }}
                  />
                </HStack>
                <p style={{ fontSize: '9px' }}>* Max Tickets per wallet</p>
              </Box>
            </Box>
            <Box width="100%" padding="2px" bg="#fefce2" color="black">
              <p style={{ padding: '0px', fontSize: '11px' }}>
                <strong>Image:</strong> Single Image NFT: Extensions:( *.png, *.gif, *jpg)
              </p>
              <ImageUpload setUrl={setFile} />
              <div>
                {file && (
                  <>
                    IPFS Hash :{' '}
                    <a href={file} target="_blank" rel="noopener noreferrer">
                      {file}
                    </a>
                  </>
                )}
              </div>
            </Box>

            <Box width="100%" padding="2px" color="black">
              <Button
                onClick={createThisRaffle}
                //type="primary"

                block
                style={{
                  backgroundColor: '#9dcfb4',
                  marginTop: '-5px',
                  fontSize: '18px',
                }}>
                Create Raffle
              </Button>
            </Box>
          </VStack>
        </Box>

        {thisInit && (
          <>
            <Box bg="rgb(229 231 235)" color="black" w="100%">
              <VStack>
                <div>{thisInit}</div>
                <div style={{ padding: '5px' }}>
                  <Button type="link" key="tokenpage" href={raffleUrl}>
                    View Raffle page
                  </Button>
                  ,
                </div>
              </VStack>
            </Box>
          </>
        )}

        {/*
        <div>
          <Box
            mt="-5px"
            p={5}
            border="0px solid blue"
            fontWeight="semibold"
            color="blue"
            bg={'white'}
            fontSize="11px"
            w={'100%'}
            maxWidth="500px"
            lineHeight="tight"
            noOfLines={[1]}
            isTruncated
            overflow={'hidden'}>
            {raffleUrl && (
              <Result
                status="success"
                title={[
                  <>
                    <p style={{ color: 'blue' }}>Successfully Deployed NFT Raffle!</p>
                  </>,
                ]}
                subTitle={[
                  <>
                    <Center>
                      <div>
                        {raffleUrl && (
                          <model-viewer
                            style={{
                              width: '350px',
                              height: '350px',
                              marginBottom: '5px',
                            }}
                            camera-controls
                            poster={raffleUrl}
                            src={raffleUrl}
                            auto-rotate></model-viewer>
                        )}
                      </div>
                    </Center>
                    <HStack>
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#9c9c9c',
                          padding: '15px',
                          marginBottom: '-10px',
                          fontWeight: 'normal',
                          overflow: 'hidden',
                        }}>
                        <a href={raffleUrl}>{raffleUrl} </a>
                      </div>
                    </HStack>
                  </>,
                ]}
                extra={[
                  <Button type="primary" key="tokenpage" href={raffleUrl}>
                    View Raffle page
                  </Button>,
                ]}
              />
            )}
          </Box>
        </div>
        */}
      </Box>
    </>
  )
}

export default DynamicRaffleFactory

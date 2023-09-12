import React, { useContext, useEffect, useState } from 'react'
import { ethers, utils } from 'ethers'
import Msig from '../contracts/Msig.json'
import { Button, Input, Box, Heading, Center, HStack, List, ListItem, VStack, Grid, GridItem, useToast, Badge, Link } from '@chakra-ui/react'
import { IconButton, useClipboard, Text } from '@chakra-ui/react'
import { CopyIcon, RepeatIcon } from '@chakra-ui/icons'
import { formatAddress, formatChainAsNum } from '../utils/formatMetamask'
import WhatNetworkSymbol from './../utils/WhatNetworkSymbol'
import { AppContext } from '../AppContext'
import WalletFactory from './MultiSig/WalletFactory'
import {KeyOutlined} from '@ant-design/icons'


const MultiSigWallet = () => {
  const { chainId, account } = useContext(AppContext)
  const [newOwner, setNewOwner] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [transactionId, setTransactionId] = useState(null)
  const toast = useToast()
  const [owners, setOwners] = useState([])
  const [signature, setSignature] = useState('')
  const [contractName, setContractName] = useState('')
  const [balance, setBalance] = useState('0')
  const [pendingTransactions, setPendingTransactions] = useState([])
  const { hasCopied, onCopy } = useClipboard(Msig.address)
  //const contractAddress = Msig.address
  const [contractAddress, setContractAddress] = useState(Msig.address)
  const contractABI = Msig.abi
  const [address, setAddress] = useState('')
  const [verifyAddress, setVerifyAddress] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('')

  const handleDeployments = (contractAddress) => {
    console.log('Selected contract address:', contractAddress)
    setContractAddress(contractAddress)
  }

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
    // Step 2: Show a toast notification when the copy action is successful
    toast({
      title: 'Copied to Clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractABI, signer)
  //const message = `${contractName} is requesting a signature for authorization`
  const message = `Contract: ${contractName}\nTransaction Id: ${transactionId}\nAmount: ${amount.toString()}\nReceiver: ${recipient}`
  const dataRows = message.split('\n')

  const reloadBalance = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://testnet.telos.net/evm')
    const contract = new ethers.Contract(contractAddress, contractABI, provider)

    try {
      const contractBalance = await contract.walletBalance()
      setBalance(ethers.utils.formatEther(contractBalance))
    } catch (error) {
      console.error('Error fetching contract balance:', error)
    }
  }

  function secondsToHoursMinutes(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours} hours ${minutes} minutes remaining`
  }

  async function reloadTransactions() {
    const transactionsData = await contract.getPendingTransactions()

    const transactions = transactionsData[0].map((txId, index) => {
      const formattedExpiryTime = secondsToHoursMinutes(transactionsData[6][index])
      return {
        id: txId,
        from: transactionsData[1][index],
        to: transactionsData[2][index],
        amount: ethers.utils.formatEther(transactionsData[3][index]),
        signatureCount: transactionsData[4][index],
        creationTime: new Date(transactionsData[5][index] * 1000).toLocaleDateString('en-US'),
        expiryTime: formattedExpiryTime,
      }
    })

    setPendingTransactions(transactions)
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractABI, signer)

    async function fetchOwners() {
      try {
        const allOwners = await contract.getAllOwners()
        setOwners(allOwners)
      } catch (error) {
        console.error('Error fetching contract balance:', error)
      }
    }

    async function fetchPendingTransactions() {
      const transactionsData = await contract.getPendingTransactions()
      const transactions = transactionsData[0].map((txId, index) => {
        const formattedExpiryTime = secondsToHoursMinutes(transactionsData[6][index])
        const dateObj = new Date(transactionsData[5][index] * 1000)
        const formattedDate = `${dateObj.toLocaleDateString('en-CA')} ${dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        return {
          id: txId,
          from: transactionsData[1][index],
          to: transactionsData[2][index],
          amount: ethers.utils.formatEther(transactionsData[3][index]),
          signatureCount: transactionsData[4][index],
          creationTime: formattedDate,
          expiryTime: formattedExpiryTime,
        }
      })

      setPendingTransactions(transactions)
    }

    fetchOwners()
    fetchPendingTransactions()
  }, [contractABI, contractAddress])

  // Fetch balance on component load
  const [minSignatures, setMinSignatures] = useState('')

  useEffect(() => {
    const fetchContractBalance = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      try {
        const ms = await contract.minSignatures()
        setMinSignatures(ms.toString())
        const name = await contract.contractName()
        setContractName(name)
        const contractBalance = await contract.walletBalance()
        setBalance(ethers.utils.formatEther(contractBalance))
      } catch (error) {
        console.error('Error fetching contract balance:', error)
      }
    }
    fetchContractBalance()
  }, [contractABI, contractAddress])

  const addOwner = async (newOwner) => {
    try {
      const tx = await contract.addOwner(newOwner)
      await tx.wait()
      alert('Owner added successfully!')
    } catch (error) {
      console.error('Error adding owner:', error)
    }
  }

  const approve = async (txId) => {
    try {
      const tx = await contract.signTransaction(txId)
      await tx.wait()
      alert('Owner added successfully!')
      reloadTransactions()
    } catch (error) {
      console.error('Error adding owner:', error)
    }
  }

  const proposeTransaction = async () => {
    try {
      const tx = await contract.transferTo(recipient, ethers.utils.parseEther(amount))
      await tx.wait()
      alert('Transaction proposed successfully!')
    } catch (error) {
      console.error('Error proposing transaction:', error)
    }
  }

  useEffect(() => {
    if (signature) {
      const verify = () => {
        const actualAddress = utils.verifyMessage(message, signature)
        console.log(actualAddress)
        setVerifyAddress(actualAddress)
        if (signature) {
          console.log('valid signature')
          setVerificationStatus('Account login verification successful!')
          //onSignature(signature)
        } else {
          console.log('wrong')
          setVerificationStatus('Invalid')
        }
      }
      verify()
    }
  }, [message, signature])

  return (
    <Center>
      <Box maxWidth={500} p={4} bg="ghostwhite">
        <Heading size="lg">Multi-sig Wallet Factory</Heading>
        <WalletFactory onDeployments={handleDeployments} />

        <Heading size="lg" mt={3}>
          <HStack>
            <Text mr={2}>Buny Multisig </Text>
            <Text fontSize="md">Balance: {balance} TLOS</Text>
            <IconButton icon={<RepeatIcon />} onClick={reloadBalance} aria-label="Copy Address" size="sm" variant="unstyled" />
          </HStack>
        </Heading>
        <Box mt={3} p={2} bg="InfoBackground" border="1px solid silver">
          <Heading size="md">Contract</Heading>
          <Text>{contractName}</Text>
          <HStack gap="auto">
            <Text fontSize={'sm'}>{Msig.address}</Text>
            <IconButton icon={<CopyIcon />} onClick={onCopy} aria-label="Copy Address" size="xs" variant="unstyled" />
          </HStack>
        </Box>

        <Box mt={3} p={2} bg="InfoBackground" border="1px solid silver">
          <Heading size="md">Add Owner</Heading>
          <Text fontSize="sm">Add a new owner to the multi-sig wallet.</Text>
          <Input size='sm' mt={3} placeholder="Owner Address" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} />
          <Text fontSize="sm">Enter the address of the new owner.</Text>
          <Center>
            <Button colorScheme="messenger" w="100%" mt={2} onClick={() => addOwner(newOwner)}>
              Add Owner
            </Button>
          </Center>
        </Box>

        <Box mt={3} p={2} bg="InfoBackground" border="1px solid silver">
          <Heading size="md">Propose Transaction</Heading>
          <Text fontSize="sm">Propose a new transaction for approval.</Text>
          <Input size='sm' mt={3} placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          <Text fontSize="sm">Enter the recipient's address.</Text>
          <Input size='sm' mt={2} placeholder="Amount (TLOS)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Text fontSize="sm">Specify the amount to send in TLOS.</Text>
          <Center>
            <Button colorScheme="messenger" w="100%" mt={2} onClick={proposeTransaction}>
              Propose
            </Button>
          </Center>
        </Box>

     
        <Box mt={3} p={2} bg="InfoBackground" border="1px solid silver">
          <Heading size="md">All Owners</Heading>
          <Text fontSize="sm">List of all registered owners in the contract.</Text>
          <Center>
          <List spacing={3}>
            {owners.map((owner) => (
              <ListItem  border="1px" borderColor="gray" borderRadius="md" p="2px" bg="ThreeDFace" w={350} key={owner}>
                <HStack>
                <KeyOutlined />
                
                <Text> {owner}</Text>
                </HStack>
              </ListItem>
            ))}
          </List>
          </Center>
        </Box>

        <Box mt={3} p={2} bg="InfoBackground" border="1px solid silver">
          <Heading size="md">
            Pending Transactions <IconButton icon={<RepeatIcon />} onClick={reloadTransactions} aria-label="Copy Address" size="sm" variant="unstyled" />
          </Heading>
          <Text fontSize="sm">Pending transactions that reach the deadline will be removed.</Text>
          <Text fontSize="sm" noOfLines={2} w={350}>
            Owners cannot sign their own proposals.
          </Text>
          <List spacing={1} p={4} mt={2} mb={2}>
            {pendingTransactions.map((tx) => (
              <Center>
                <ListItem key={tx.id} border="1px" borderColor="gray" borderRadius="md" p="4px" bg="ThreeDFace" w={320}>
                  <VStack align="start" spacing={2}>
                    <Center w="100%" bg="ghostwhite">
                      <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                        <GridItem colSpan={2}>
                          <HStack p={1} gap="18px">
                            <Badge colorScheme="purple">
                              <Text>
                                <b>Tx:</b> {tx.id.toString()}
                              </Text>
                            </Badge>
                          </HStack>
                        </GridItem>
                        <GridItem colStart={4} colEnd={6}>
                        <Badge variant='outline' colorScheme='green'>
                        <HStack gap="4px">
                            <Text>
                              <b>VALUE:</b> {tx.amount.toString()}
                            </Text>
                            <WhatNetworkSymbol chainId={chainId} />
                          </HStack>
  </Badge>
          
                        </GridItem>
                      </Grid>
                    </Center>
                    <Text w={300} noOfLines={3}>
                      <b>Created:</b> {tx.creationTime.toString()}
                    </Text>


                    <Center w="100%" bg="ghostwhite">
                      <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                        <GridItem colSpan={2}>
                          <Text>
                            <b>From:</b> {formatAddress(tx.from)}
                          </Text>
                        </GridItem>
                        <GridItem colStart={4} colEnd={6}>
                          <Text>
                            <b>To:</b> {formatAddress(tx.to)}
                          </Text>
                        </GridItem>
                      </Grid>
                    </Center>

                    <HStack>
                      <Text>
                        <b>Signatures:</b> {tx.signatureCount.toString()}
                      </Text>
                      <Text ml={-1}>/ {minSignatures}</Text>
                      <Link variant={'link'} href={`https://testnet.teloscan.io/address/${contractAddress}`} target={'_blank'}>
                        View
                        
                      </Link>
                    </HStack>

                    <Box w="100%" bg="ghostwhite">
                    <Text p={1}>
                      <b>Deadline:</b> {tx.expiryTime.toString()}
                    </Text>
                    </Box>
                    <Button w="100%" size={'sm'} colorScheme="purple" mt={2} onClick={() => approve(tx.id)}>
                      <HStack gap="4px">
                        <Text>Approve {tx.amount.toString()}</Text>
                        <WhatNetworkSymbol chainId={chainId} />
                      </HStack>
                    </Button>
                  </VStack>
                </ListItem>
              </Center>
            ))}
          </List>
        </Box>
      </Box>
    </Center>
  )
}

export default MultiSigWallet

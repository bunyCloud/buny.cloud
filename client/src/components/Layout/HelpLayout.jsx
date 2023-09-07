import React from 'react'
import {
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  AccordionIcon,
  Heading,
} from '@chakra-ui/react'
import { Layout } from 'antd'

const { Header, Content, Footer, Sider } = Layout

export default function HelpLayout() {
  return (
    <>
      <Box bg="white" p={5} w={'100%'}>
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Buny Raffle
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box p={10}>
                <Heading mt={5} mb={6} as="h5">
                  Experimental Buny NFT Raffle.
                </Heading>

                <Heading mt={5} mb={-5} as="h6">
                  Raffle Factory Contract
                </Heading>
                <Text fontSize="12px">Used to create and deploy Buny Raffle NFT Collections.</Text>
                <Text fontSize="12px">
                  <Heading mt={5} mb={-5} as="h6">
                    Raffle NFT Contract
                  </Heading>
                  ERC721 NFT contract modified to transfer AVAX to random ticket holder using a verifiable delay
                  function.
                </Text>
                <Text fontSize="12px">
                  <Heading mt={5} mb={-5} as="h5">
                    How it works
                  </Heading>
                  Players can participate and create NFT raffles using the Buny Raffle dapp. Configure number of
                  tickets, ticket price, minimum players, maximum tickets per wallet and NFT Image.
                </Text>
                <Text fontSize="12px">
                  <Heading mt={5} mb={-5} as="h6">
                    Number of tickets:
                  </Heading>
                  Number of tickets is the total amount of tickets or nfts per given raffle event.
                  <Heading mt={5} mb={-5} as="h6">
                    Ticket price
                  </Heading>
                  Amount per ticket traded for native chain token. (ie. ETH for Ethereum, AVAX for Avalanche, TLOS for
                  Telos, Matic for Polygon)
                  <Heading mt={5} mb={-5} as="h6">
                    Min. Players:
                  </Heading>
                  The minimum amount of unique players required to complete raffle.
                  <Heading mt={5} mb={-5} mt={5} mb={-5} as="h6">
                    Max. Tickets
                  </Heading>
                  Maximum amount of tickets allowed per wallet address.
                  <Heading mt={5} mb={-5} as="h6">
                    Image
                  </Heading>
                  A standard .png or .jpg image set for each ticket/Nft. All tickets/nfts will have the same image.
                  Images are uploaded to IPFS and pinned to Buny in-house IPFS node and or remote Infura.io IPFS node.
                </Text>
                <Text fontSize="12px">
                  <Heading mt={5} mb={-5} as="h6">
                    Event Start times
                  </Heading>
                  A raffle event once created and deployed will be listed in the directory but the raffle itself does
                  not start until the raffle is approved by the owner. Raffles can be approved on the raffle listing page by
                  clicking the "Approve" button.
                </Text>
                <Text fontSize="12px">
                  <Heading mt={5} mb={-5} as="h6">
                    Winner
                  </Heading>
                  Every player receives a raffle NFT. Every player is a winner but, only one lucky player holding the
                  randomly selected token id will take the "carrot" (prize).
                </Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Marketplace
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Avalanche NFT Marketplace. Only a small 0.025 avax listing fee and 0% on all sales.
            </AccordionPanel>
          </AccordionItem>

      
        </Accordion>
      </Box>
    </>
  )
}

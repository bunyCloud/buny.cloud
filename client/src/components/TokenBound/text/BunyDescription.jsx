import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const BunyDescription = () => {
  return (
    <div>
    <Box p={4} bg='InfoBackground' mt={1}>
      <Text fontSize="xl" fontWeight="bold">Buny Portal</Text>
      <Text fontSize="lg" fontWeight="semibold" mt={4}>Features:</Text>

      <Text fontSize="md" fontWeight="bold" mt={4}>NFT Token Bound Account Creation:</Text>
      <Text mt={2}>Unique Identity: With Buny Portal, users can create accounts that are uniquely bound to a specific NFT (Non-Fungible Token). This ensures a one-of-a-kind digital identity for each user, leveraging the distinctiveness of NFTs.</Text>
      <Text mt={2}>Enhanced Security: By tying accounts to NFTs, Buny Portal adds an extra layer of security, making unauthorized access even more challenging.</Text>
      <Text mt={2}>Digital Ownership: Users not only get a digital account but also a sense of true digital ownership, as the NFT represents a verifiable proof of authenticity and ownership.</Text>

      <Text fontSize="md" fontWeight="bold" mt={4}>P2P On-Chain Encrypted Messaging:</Text>
      <Text mt={2}>Direct & Secure: Buny Portal's messaging system allows users to communicate directly with each other using peer-to-peer technology, ensuring no intermediaries.</Text>
      <Text mt={2}>On-Chain Benefits: Messages are stored on the blockchain, providing transparency, immutability, and verifiability.</Text>
      <Text mt={2}>End-to-End Encryption: All messages are encrypted end-to-end, ensuring that only the intended recipient can read them, safeguarding user privacy.</Text>

      <Text fontSize="md" fontWeight="bold" mt={4}>Multi-Signature Wallet Creation:</Text>
      <Text mt={2}>Enhanced Security: Multi-signature wallets require multiple private keys to authorize a transaction, significantly increasing security.</Text>
      <Text mt={2}>Collaborative Control: Ideal for teams or partnerships, multi-signature wallets ensure that no single individual has complete control over funds or assets.</Text>
      <Text mt={2}>Flexible Configurations: Users can set up their multi-signature wallets based on their needs, such as requiring two out of three signatures for a transaction.</Text>
</Box>
    </div>
  );
}

export default BunyDescription;

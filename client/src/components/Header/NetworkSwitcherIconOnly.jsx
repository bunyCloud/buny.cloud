import { useState, useEffect } from 'react';
import { Button, Image, Text, Tooltip } from '@chakra-ui/react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from '@chakra-ui/react'
import { useSDK } from '@metamask/sdk-react';

const NetworkSwitcherIconOnly = () => {
  const [selectedNetwork, setSelectedNetwork] = useState(''); // State to keep track of the selected network
  const { wallet } = useSDK(); // Use the MetaMask context to get the current wallet details
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to keep track of whether the menu is open


  const switchNetwork = async (chainId) => {
    try {
        if (!window.ethereum) {
            throw new Error('Metamask not installed or not accessible.');
        }

        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (currentChainId === chainId) {
            console.log('Already on the desired network.');
            return;
        }

        let chainName, rpcUrl, blockExplorerUrl;
        if(chainId === 40) {
            chainName = 'Telos Mainnet';
            rpcUrl = 'https://mainnet.telos.net/evm';
            blockExplorerUrl = 'https://teloscan.io/';
        } else if(chainId === 41) {
            chainName = 'Telos Testnet';
            rpcUrl = 'https://testnet15.telos.caleos.io/evm';
            blockExplorerUrl = 'https://testnet.telos.net';
        } else {
            throw new Error('Unsupported chainId');
        }

        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x' + chainId.toString(16),
                chainName,
                nativeCurrency: {
                    name: 'Telos',
                    symbol: 'TLOS',
                    decimals: 18,
                },
                rpcUrls: [rpcUrl],
                blockExplorerUrls: [blockExplorerUrl],
            }],
        });

        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + chainId.toString(16) }],
        });

        console.log('Network switched successfully.');
    } catch (error) {
        console.error('Failed to switch network:', error);
    }
};

// ...

useEffect(() => {
    const handleNetworkSwitch = async () => {
        if (selectedNetwork === 'Telos Mainnet') {
            await switchNetwork(40);
        } else if (selectedNetwork === 'Telos Testnet') {
            await switchNetwork(41);
        }
    };

    if (selectedNetwork !== '') {
        handleNetworkSwitch();
    }
}, [selectedNetwork]);

// ...


  
  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

 


  useEffect(() => {
    // Function to handle the network switch
    const handleNetworkSwitch = async () => {
      // Based on the selectedNetwork value, you can call the necessary method to switch the network
      // In this example, I'm assuming you have a function named 'switchNetwork' to handle network switching
      if (selectedNetwork === 'telos-mainnet') {
        await switchNetwork(40); // Call 'switchNetwork' with the chain ID for Telos Mainnet (40)
      } else if (selectedNetwork === 'Telos Testnet') {
        await switchNetwork(41); // Call 'switchNetwork' with the chain ID for Telos Testnet (41)
      }
    };

    if (selectedNetwork !== '') {
      handleNetworkSwitch();
    }
  }, [selectedNetwork]);

  const handleNetworkChange = async (value) => {
    setSelectedNetwork(value); // Update the selected network on change
  };

  return (
    <Menu onOpen={handleMenuOpen} onClose={handleMenuClose}>

                <Tooltip hasArrow label="Switch Network" bg="#c1cfd8" color="black">

      <MenuButton size={'auto'} bg={'transparent'} as={Button} __css={{ _hover: { boxShadow: 'none' } }}  >
      
        {/*
      <Image boxSize='33px' bg='transparent' src='/telos.png' mr='-2px'  />
        */}
              <model-viewer 
              style={{
                        width: '33px',
                        height: '33px',
                        marginTop: '-3px',
                        backgroundColor: 'transparent',
                      }}
                      src="/telos.glb"
                      poster="/lucky.png"
      //                 ar 
    //                   ar-modes="scene-viewer webxr quick-look" 
                       //camera-controls 
                       shadow-intensity="0.99" 
                       auto-rotate={isMenuOpen ? true : false} // Conditionally enable auto-rotate based on the menu state

                       shadow-softness="0.57"
                       >
    
</model-viewer>

      
      </MenuButton>
      </Tooltip>
      <MenuList color='purple'>
        <MenuItem minH='48px' onClick={() => handleNetworkChange('Telos Testnet')}>
          <Image boxSize='2rem' borderRadius='full' src='/telos.png' mr='6px' />
          <Text>Telos Testnet</Text>
        </MenuItem>
        <MenuItem minH='40px' onClick={() => handleNetworkChange('Telos Mainnet')}>
          <Image boxSize='2rem' borderRadius='full' src='/telos.png' mr='6px' />
          <Text>Telos Mainnet</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NetworkSwitcherIconOnly;

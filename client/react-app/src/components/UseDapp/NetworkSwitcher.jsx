import React, {useState} from 'react';
import { Modal, Button, Avatar } from 'antd';

import { VStack, HStack,  Tag } from '@chakra-ui/react';
import {
  useEthers,
  Mainnet,
  Avalanche,
  Polygon,
  Mumbai,
  AvalancheTestnet,
  Arbitrum,
  ArbitrumGoerli,
  Optimism,
  OptimismKovan,
  Fantom,
  FantomTestnet,
} from '@usedapp/core'
import { Telos, TelosTestnet, BSC, BSCTestnet } from './UseDappCore'



const NetworkSwitcher = ({ networkName, chainId, switchNetwork }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalToggle = () => {
    setIsModalVisible(!isModalVisible);
  };

  const networks = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      image:
        'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png',
      chainId: Mainnet.chainId,
    },
    {
      id: 'avalanche',
      name: 'Avalanche',
      image:
        'https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png',
      chainId: Avalanche.chainId,
    },
    {
      id: 'telos',
      name: 'Telos',
      image:
        'https://assets-global.website-files.com/60ae1fd65f7b76f18ddd0bec/61044a5f70f5bbeb24b995ea_Symbol%202%402x.png',
      chainId: Telos.chainId,
    },
    {
      id: 'polygon',
      name: 'Polygon',
      image:
        'https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png',
      chainId: Polygon.chainId,
    },
    {
      id: 'bsc',
      name: 'BSC',
      image:
        'https://assets-cdn.trustwallet.com/blockchains/smartchain/info/logo.png',
      chainId: BSC.chainId,
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum',
      image:
        'https://metaverse-marauders.s3.eu-west-3.amazonaws.com/arbitrum_4366c46586.svg',
      chainId: Arbitrum.chainId,
    },
    {
      id: 'optimism',
      name: 'Optimism',
      image:
        'https://altcoinsbox.com/wp-content/uploads/2023/03/optimism-logo.jpg',
      chainId: Optimism.chainId,
    },
    {
      id: 'fantom',
      name: 'Fantom',
      image:
        'https://s3.coinmarketcap.com/static/img/portraits/62d51d9af192d82df8ff3a83.png',
      chainId: Fantom.chainId,
    },
  ];

  return (
    <>
      <div style={{ color: 'black', fontSize: '12px' }}>
        <Tag color="green">
          <HStack>
            <div>{networkName}</div>
            <div>{chainId}</div>
          </HStack>
        </Tag>
      </div>
      <div>
        {networks.map((network) => (
          <React.Fragment key={network.name}>
            <Avatar src={network.logoSrc} onClick={handleModalToggle} />
            <Modal
              visible={isModalVisible}
              onCancel={handleModalToggle}
              footer={null}
            >
              <Button
                style={{ width: '80px', fontSize: '12px' }}
                onClick={() => switchNetwork(network.chainId)}
                disabled={chainId === network.chainId}
              >
                {network.name}
              </Button>
             </Modal>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default NetworkSwitcher;
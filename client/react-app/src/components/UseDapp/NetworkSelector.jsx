import { Select, Tag } from 'antd';
import { useState } from 'react';
import { useEthers, useEtherBalance, Mainnet, Avalanche, Polygon, Mumbai, AvalancheTestnet } from '@usedapp/core'

const { Option } = Select;

const NetworkSelector = ({ networkName, chainId, switchNetwork }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('');

  const handleNetworkChange = (value) => {
    setSelectedNetwork(value);
    
    switch (value);
  };

  return (
    <div>
      <div style={{ color: 'black', fontSize: '12px' }}>
        <Tag color="green">
          {networkName} ({chainId})
        </Tag>
      </div>
      <div>
        <Select
          style={{ width: '80px', fontSize: '12px' }}
          value={selectedNetwork}
          onChange={handleNetworkChange}
        >
          <Option value="">Select network</Option>
          <Option
            value={Mainnet.chainId}
            disabled={chainId === Mainnet.chainId}
          >
            Ethereum
          </Option>
          <Option value="">NA</Option>
          <Option
            value={Avalanche.chainId}
            disabled={chainId === Avalanche.chainId}
          >
            Avalanche
          </Option>
          <Option
            value={AvalancheTestnet.chainId}
            disabled={chainId === AvalancheTestnet.chainId}
          >
            Fuji
          </Option>
          <Option
            value={Telos.chainId}
            disabled={chainId === Telos.chainId}
          >
            Telos Mainnet
          </Option>
          <Option
            value={TelosTestnet.chainId}
            disabled={chainId === TelosTestnet.chainId}
          >
            Telos
          </Option>
          <Option
            value={Polygon.chainId}
            disabled={chainId === Polygon.chainId}
          >
            Polygon
          </Option>
          <Option
            value={Mumbai.chainId}
            disabled={chainId === Mumbai.chainId}
          >
            Mumbai
          </Option>
        </Select>
      </div>
      <hr />
    </div>
  );
};

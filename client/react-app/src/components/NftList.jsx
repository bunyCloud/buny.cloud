import React, { useState, useEffect } from 'react';
import { List, Spin } from 'antd';
import { ethers } from 'ethers';
import axios from 'axios';
import BunyRaffleNft from '../contracts/BunyRaffleNft.json';
import { Box } from '@chakra-ui/react';

const NFTList = ({ contractAddress }) => {
  const [loading, setLoading] = useState(true);
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(' https://mainnet.telos.net/evm')
        const contract = new ethers.Contract(contractAddress, BunyRaffleNft.abi, provider);
        const totalSupply = await contract.totalSupply();

        const nftsData = [];
        for (let i = 0; i < totalSupply; i++) {
          const tokenId = await contract.nftTokenIds(i);
          const tokenURI = await contract.tokenURI(tokenId);

          const response = await axios.get(tokenURI);
          console.log(response);
          nftsData.push({
            id: tokenId.toNumber(),
            image: response.data.image,
          });
        }
        setNFTs(nftsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNFTs();
  }, [contractAddress]);

  return (
    <Spin spinning={loading}>
      <Box mt={20}>
      <List
        grid={{  column: 1 }}
        dataSource={nfts}
        renderItem={(nft) => (
          <List.Item key={nft.id}>
            <img src={nft.image} width="50px" height= alt={`NFT ${nft.id}`} />
            <div>
                {nft.name}
            </div>
          </List.Item>
        )}
      />
      </Box>
    </Spin>
  );
};

export default NFTList;

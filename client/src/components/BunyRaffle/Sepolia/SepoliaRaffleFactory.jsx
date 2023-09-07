import React, { useState, useEffect } from "react";
import { Box, Center, HStack, Link, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import raffleFactory from "contracts/sepolia/BunyRaffleFactory.json";
import {
  SepoliaRaffleFactoryAddress,
  SepoliaRaffleNftAddress,
} from "contracts/config/networkAddress";
import { ImageUpload } from "react-ipfs-uploader";
import { Input, Tag, Button, Result } from "antd";

function SepoliaRaffleFactory() {
  const [thisInit, setInitiate] = useState();
  const [thisDeploy, setDeploy] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [editionSize, setRaffleSize] = useState();
  const [ticketCount, setTicketCount] = useState();
  const [ticketPrice, setTicketPrice] = useState();
  const [thisDescription, setDescription] = useState();
  const [file, setFile] = useState();
  const [minPlayers, setMinPlayers] = useState();
  const [maxTokens, setMaxTokens] = useState();

  const { TextArea } = Input;
  const [raffleUrl, setRaffleUrl] = useState();
  function refreshPage() {
    setTimeout(() => {
      window.location.reload()
    }, 2000) // 5000 milliseconds = 5 seconds
  }


  async function createThisRaffle() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // Mint NFT token
    const contract = new ethers.Contract(
      SepoliaRaffleFactoryAddress,
      raffleFactory.abi,
      signer,
    );
    const units = ethers.utils.parseUnits(ticketPrice);
    const transaction = await contract.createEdition(
      thisDescription,
      file,
      ticketCount,
      units,
      minPlayers,
      maxTokens,
    );
    const tx = await provider.getTransaction(transaction.hash);
    if (tx) {
      if (tx.blockNumber) {
        console.log("tx: ");
        console.log(tx);
        return tx;
      }
      refreshPage();
    }
    setInitiate("Deploying NFT Raffle..", tx);
    setDeploy(`https://teloscan.io/tx/${transaction.hash}`);
    contract.on(
      "CreatedEdition",
      (
        editionId,
        creator,
        editionSize,
        editionContractAddress,
        minPlayers,
        maxTokens,
        salePrice,
        event,
      ) => {
        const info = {
          editionId: ethers.utils.formatUnits(editionId, 0),
          creator: creator,
          editionSize: ethers.utils.formatUnits(editionSize, 0),
          editionContractAddress: editionContractAddress,
          minPlayers: minPlayers.toString(),
          maxTokens: maxTokens.toString(),
          salePrice: ethers.utils.formatEther(ticketPrice, "ether"),
          data: event,
        };
        console.log(JSON.stringify(info, null, 5));
        setContractAddress(editionContractAddress);
        setRaffleSize(editionSize.toString());
        setRaffleUrl(`https://buny.cloud/raffle/${contractAddress}`);
        refreshPage();
      },
    );
  }

  return (
    <>
      <Box
        bg="transparent"
        //border={"1px solid blue"}
        mt={10}
        p={5}
        isTruncated
        w={"100%"}
        maxWidth={400}
        style={{
          fontSize: "12px",
          padding: "10px",
          color: "white",
          textAlign: "left",
        }}
      >
        <h5 style={{ color: "Blue" }}>Create Buny NFT Raffle</h5>
        <h6 style={{ color: "Blue" }}>Telos </h6>
        <Center bg="rgb(229 231 235)">
          <HStack gap={5}>
            <div style={{ marginBottom: "5px" }}>
              <Link
                href={`https://teloscan.io/address/${SepoliaRaffleFactoryAddress}`}
                color="blue"
                m={5}
                target={"_blank"}
              >
                Factory Contract
              </Link>
            </div>
            <div style={{ marginBottom: "5px" }}>
              <Link
                href={`https://teloscan.io/address/${SepoliaRaffleNftAddress}`}
                color="blue"
                m={5}
                target={"_blank"}
              >
                Raffle Contract
              </Link>
            </div>
          </HStack>
        </Center>
        <Box>
          <VStack>
            <Box bg="rgb(229 231 235)">
              <Box width="100%" padding="6px" bg="white" color="black">
                <div>
                  <p style={{ padding: "5px" }}>
                    <strong>Description:</strong>
                  </p>
                </div>
                <TextArea
                  placeholder="Description of NFT Raffle"
                  rows={4}
                  style={{
                    padding: 5,
                    width: "300px",
                    color: "black",
                    fontSize: 12,
                  }}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  value={thisDescription}
                />
              </Box>

              <Box width="100%" padding="6px" bg="white" color="black">
                <HStack>
                  <div>
                    <p style={{ padding: "5px" }}>
                      <strong># of Tickets:</strong>
                    </p>
                  </div>
                  <Input
                    placeholder="Ticket count"
                    onChange={(e) => {
                      setTicketCount(e.target.value);
                    }}
                    value={ticketCount}
                    style={{
                      padding: 5,
                      marginBottom: "10px",
                      width: "100%",

                      color: "black",
                      fontSize: 12,
                    }}
                  />
                </HStack>
              </Box>

              <Box width="100%" padding="6px" bg="white" color="black">
                <HStack>
                  <div>
                    <p style={{ padding: "5px" }}>
                      <strong>Ticket Price:</strong>
                    </p>
                  </div>
                  <Input
                    placeholder="Ticket Price"
                    onChange={(e) => {
                      setTicketPrice(e.target.value);
                    }}
                    value={ticketPrice}
                    style={{
                      padding: 5,
                      marginBottom: "10px",
                      width: "100%",

                      color: "black",
                      fontSize: 12,
                    }}
                  />
                </HStack>
              </Box>

              <Box width="100%" padding="6px" bg="white" color="black">
                <HStack>
                  <div>
                    <p style={{ padding: "5px" }}>
                      <strong>Min. Players</strong>
                    </p>
                  </div>
                  <Input
                    placeholder="Min. players"
                    onChange={(e) => {
                      setMinPlayers(e.target.value);
                    }}
                    value={minPlayers}
                    style={{
                      padding: 5,
                      marginBottom: "10px",
                      width: "100%",

                      color: "black",
                      fontSize: 12,
                    }}
                  />
                </HStack>
                <p style={{ fontSize: "9px" }}>
                  *Min. Players to complete raffle
                </p>
              </Box>

              <Box width="100%" padding="6px" bg="white" color="black">
                <HStack>
                  <div>
                    <p style={{ padding: "5px" }}>
                      <strong>Max. Tickets</strong>
                    </p>
                  </div>
                  <Input
                    placeholder="Max Tickets per Wallet"
                    onChange={(e) => {
                      setMaxTokens(e.target.value);
                    }}
                    value={maxTokens}
                    style={{
                      padding: 5,
                      marginBottom: "10px",
                      width: "100%",

                      color: "black",
                      fontSize: 12,
                    }}
                  />
                </HStack>
                <p style={{ fontSize: "9px" }}>* Max Tickets per wallet</p>
              </Box>
            </Box>
            <Box width="100%" padding="6px" bg="white" color="black">
              <p style={{ padding: "5px" }}>
                <strong>Image:</strong> Single Image NFT: Extensions:( *.png,
                *.gif, *jpg)
              </p>
              <ImageUpload setUrl={setFile} />
              <div>
                {file && (
                  <>
                    IPFS Hash :{" "}
                    <a href={file} target="_blank" rel="noopener noreferrer">
                      {file}
                    </a>
                  </>
                )}
              </div>
            </Box>

            <Box width="100%" padding="6px" bg="white" color="black">
              <Button
                onClick={createThisRaffle}
                type="primary"
                block
                style={{
                  //              backgroundColor: "transparent",
                  marginTop: "5px",
                }}
              >
                Create Raffle
              </Button>
            </Box>
          </VStack>
        </Box>
        <Box bg="rgb(229 231 235)" color="black">
          {thisInit && (
            <>
              <div>{thisInit}</div>
              <div>{thisDeploy}</div>
            </>
          )}
        </Box>
        <div>
          <Box
            mt="-5px"
            p={5}
            border="0px solid blue"
            fontWeight="semibold"
            color="blue"
            bg={"white"}
            fontSize="11px"
            w={"100%"}
            maxWidth="500px"
            lineHeight="tight"
            noOfLines={[1]}
            isTruncated
            overflow={"hidden"}
          >
            {raffleUrl && (
              <Result
                status="success"
                title={[
                  <>
                    <p style={{ color: "blue" }}>
                      Successfully Deployed NFT Raffle!
                    </p>
                  </>,
                ]}
                subTitle={[
                  <>
                    <Center>
                      <div>
                        {raffleUrl && (
                          <model-viewer
                            style={{
                              width: "350px",
                              height: "350px",
                              marginBottom: "5px",
                            }}
                            camera-controls
                            poster={raffleUrl}
                            src={raffleUrl}
                            auto-rotate
                          ></model-viewer>
                        )}
                      </div>
                    </Center>
                    <HStack>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#9c9c9c",
                          padding: "15px",
                          marginBottom: "-10px",
                          fontWeight: "normal",
                          overflow: "hidden",
                        }}
                      >
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
      </Box>
    </>
  );
}

export default SepoliaRaffleFactory;

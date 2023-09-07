import { Box, Text, HStack } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
//import "./App.css";
import apiClient from "./http-common";
import axios from "axios";

export default function AvaxUsd() {
  const get_id = useRef(null);
  const get_title = useRef(null);

  const post_title = useRef(null);
  const post_description = useRef(null);

  const put_id = useRef(null);
  const put_title = useRef(null);
  const put_description = useRef(null);
  const put_published = useRef(null);

  const delete_id = useRef(null);

  const [getResult, setGetResult] = useState(null);
  const [postResult, setPostResult] = useState(null);
  const [putResult, setPutResult] = useState(null);
  const [deleteResult, setDeleteResult] = useState(null);

  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=avalanche-2%2C%20ethereum%2C%20bitcoin%2C%20telos%2C%20pax-gold%2C%20eos%2C%20optimism%2C%20arbitrum%2C%20fantom%2C%20matic-network%2C%20binancecoin%2C%20chainlink%2C%20tether-eurt&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => setData(response.data))
      .catch((e) => console.log(e));
  }, []);
  // Fetching data and catching possible errors

  const clearGetOutput = () => {
    setGetResult(null);
  };

  return (
    <div>
      <Box m={5}>
        {data.length === 0 ? (
          <Box>
            <Text>Loading ...</Text>
          </Box>
        ) : (
          <Box w={"100%"} minWidth={375} fontSize="12px" p={5} border="3px solid #514d5b">
            <HStack bg="#fdeeb3" mb={2}>
              <Box width="35%">
                <Text>COIN</Text>
              </Box>
              <Box width="20%">
                <Text>USD</Text>
              </Box>
              <Box width="20%">
                <Text>24hr</Text>
              </Box>
              <Box width="25%">
                <Text>ATH</Text>
              </Box>
            </HStack>

            {data.map(
              ({
                id,
                name,
                image,
                current_price,
                price_change_percentage_24h,
                ath,
              }) => (
                <Box key={id}>
                  <HStack>
                    <Box width="35%">
                      <HStack>
                        <img src={image} width="20px" height="20px" />
                        <Text>{name}</Text>
                      </HStack>
                    </Box>
                    <Box width="20%">
                      <Text color="volcano">
                        {"$" + current_price.toLocaleString()}
                      </Text>
                    </Box>
                    <Box width="20%">
                      <Text
                        backgroundColor={
                          Math.sign(price_change_percentage_24h) < 0
                            ? "red"
                            : "green"
                        }
                      >
                        {price_change_percentage_24h.toFixed(2) + "%"}
                      </Text>
                    </Box>
                    <Box width="25%">
                      <Text color="black">{"$" + ath.toLocaleString()}</Text>
                    </Box>
                  </HStack>
                </Box>
              ),
            )}
          </Box>
        )}
      </Box>
    </div>
  );
}

import { Button, Input } from "antd";
import "antd/dist/antd.css";
import React, { useState } from "react";
import { Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const NftSearchBar = ({
  searchQuery,
  searchNFTs,
  handleChange,
  handleKeyDown,
}) => {
  const [query, setQuery] = useState();
  return (
    <React.Fragment>
      <div
        style={{
          border: "1px solid blue",
          padding: "15px",
          width: "100%",
          backgroundColor: "black",
        }}
      >
        <Center>
          <Input
            style={{ width: "250px", height: "40px" }}
            variant="flushed"
            className="searchInput"
            type="text"
            value={searchQuery}
            placeholder="AVAX NFT Name Search"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <Button
            style={{ marginLeft: "10px", height: "40px", width: "100px" }}
            className="searchButton"
            onClick={searchNFTs}
          >
            BUNY
          </Button>
        </Center>
      </div>
    </React.Fragment>
  );
};

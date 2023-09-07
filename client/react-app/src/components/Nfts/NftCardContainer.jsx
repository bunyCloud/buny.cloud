import { Center, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import { NftCard } from "./NftCard";

const styles = {
  NftTables: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "white",
  },
};

export const NftCardContainer = ({ searchResult, loading }) => {
  return (
    <>
      <React.Fragment>
        <div style={styles.NftTables}>
          {searchResult?.length > 0 ? (
            searchResult?.map((nft, index) => (
              <NftCard data={nft} key={index} />
            ))
          ) : (
            <h3>No Result found. Try "apes"</h3>
          )}
        </div>
      </React.Fragment>
    </>
  );
};

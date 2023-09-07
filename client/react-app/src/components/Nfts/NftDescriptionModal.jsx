import React from "react";
import { NftHistoryTable } from "./NftHistoryTable";
import { Image } from "antd";
import fallbackImg from "../icons/bunyBlue.svg";

export default function NftDescriptionModal({
  nftName,
  nftDescription,
  showModal,
  image,
  nftAddress,
  token_address,
  image_url_png,
}) {
  return (
    <React.Fragment>
      <div>
        <div>
          <div>
            <div>
              <h4>{nftName}</h4>
            </div>
            <div>
              <p>
                <strong>Address:</strong> {token_address}
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <Image
                fallback={fallbackImg}
                src={image_url_png || image}
                alt={nftName}
                height="350px"
                width="350px"
                preview={false}
              />
            </div>
            <div>
              <p>
                <strong>Description: </strong>
                {nftDescription}
              </p>
            </div>
            <p>
              <strong>NFT History</strong>
            </p>
            <div>
              <NftHistoryTable nftAddress={token_address} />
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </React.Fragment>
  );
}

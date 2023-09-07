import React from "react";
//import { NoticeBar } from "antd-mobile";
import { Button, Alert } from "antd";
import { CompassOutline } from "antd-mobile-icons";

export default function HashboxNotice() {
  return (
    <>
      {/*
      <NoticeBar
        style={{width:'375px' , color: "blue", fontSize: "12px" }}
        content="Raffle dapp is being developed on Avalanche Fuji Testnet  "
        wrap="true"
        delay={"100"}
        icon={<CompassOutline />}
        color="alert"
      />
      */}
      <Alert
        message="Hashbox is an experimental IPFS management dapp and is in active development."
        type="success"
        showIcon
        closable
      />
    </>
  );
}

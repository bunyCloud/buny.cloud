import React from "react";
//import { NoticeBar } from "antd-mobile";
import { Button, Alert } from "antd";
import { CompassOutline } from "antd-mobile-icons";

export default function AvaxNotice() {
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
        message="Buny Raffle experimental release v0.01 now on Avalanche mainnet! "
        type="success"
        showIcon
        closable
      />
    </>
  );
}

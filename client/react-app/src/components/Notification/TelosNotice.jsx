import React from "react";
//import { NoticeBar } from "antd-mobile";
import { Button, Alert } from "antd";
import { CompassOutline } from "antd-mobile-icons";

export default function TelosNotice() {
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
        message="Raffle dapp is being developed on Telos Testnet  "
        type="success"
        showIcon
        closable
      />
    </>
  );
}

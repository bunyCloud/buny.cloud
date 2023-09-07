import React from "react";
import { NoticeBar } from "antd-mobile";
import { CompassOutline, CloseCircleOutline } from "antd-mobile-icons";

export default function HeaderNotice() {
  return (
    <>
      <NoticeBar
        style={{ minWidth: "350px", color: "blue", fontSize: "12px" }}
        content="Experimental beta dapp now live on Avalanche mainnet.  "
        wrap="true"
        delay={"10000"}
        icon={<CompassOutline />}
        color="alert"
      />
    </>
  );
}

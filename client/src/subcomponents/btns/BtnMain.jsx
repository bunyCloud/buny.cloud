import React from "react";
import SmallLoader from "../loading/SmallLoader";
import BtnHelper from "./BtnHelper";
import { Button } from "antd";

export default function BtnMain({ icon, text, onClick, className, disabled }) {
  return (
    <Button type="primary" block disabled={disabled} onClick={onClick}>
      {disabled == true ? (
        <SmallLoader />
      ) : (
        <BtnHelper icon={icon} text={text} />
      )}
    </Button>
  );
}

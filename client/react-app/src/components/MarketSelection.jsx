import React from "react";
import { Select } from "antd";

function MarketSelection() {
  const { Option } = Select;
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <Select
      mode="multiple"
      style={{
        width: "100%",
      }}
      placeholder=" nft marketplace selection"
      defaultValue={["buny"]}
      onChange={handleChange}
      optionLabelProp="label"
    >
      <Option value="buny" label="buny">
        <div className="demo-option-label-item">
          <span role="img" aria-label="Buny">
            Buny Market
          </span>
        </div>
      </Option>
      <Option value="opensea" label="OpenSea">
        <div className="demo-option-label-item">
          <span role="img" aria-label="OpenSea">
            OpenSea
          </span>
        </div>
      </Option>
      <Option value="traderjoe" label="Trader Joes">
        <div className="demo-option-label-item">
          <span role="img" aria-label="Trader Joes">
            Trader Joes
          </span>
        </div>
      </Option>
    </Select>
  );
}
export default MarketSelection;

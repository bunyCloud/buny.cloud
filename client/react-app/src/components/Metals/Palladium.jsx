import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "antd";

const PalladiumPrice = () => {
  const [palladiumPrice, setPalladiumPrice] = useState(null);
  const [xpdTimestamp, setXpdTimestamp] = useState();

  useEffect(() => {
    axios
      .get(
        "https://metals-api.com/api/latest?access_key=jq8aan9o4e2oq295fkbxdjs4s0d295yt7q1i3vikhgb83rpg1ykmdpfb3rtf&base=USD&symbols=XPD"
      )
      .then((response) => {
        setPalladiumPrice(response.data.rates.USDXPD);
        setXpdTimestamp(response.data.timestamp);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const columns = [
    {
      title: "Asset Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Asset Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const data = [
    {
      key: "1",
      name: "Palladium",
      price: palladiumPrice ? `$${palladiumPrice.toFixed(2)}` : "Loading...",
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default PalladiumPrice;

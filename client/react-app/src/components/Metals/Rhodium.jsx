import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "antd";

const RhodiumPrice = () => {
  const [rhodiumPrice, setRhodiumPrice] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://metals-api.com/api/latest?access_key=jq8aan9o4e2oq295fkbxdjs4s0d295yt7q1i3vikhgb83rpg1ykmdpfb3rtf&base=USD&symbols=XRH"
      )
      .then((response) => {
        setRhodiumPrice(response.data.rates.USDXRH);
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
      name: "Rhodium",
      price: rhodiumPrice ? `$${rhodiumPrice.toFixed(2)}` : "Loading...",
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default RhodiumPrice;

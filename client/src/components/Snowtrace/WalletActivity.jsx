import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

const WalletActivity = ({ account }) => {
  const [data, setData] = useState([]);
  const snowKey = "2CMZM5MVNTMD89255Q9ZUSJ176K68AX3S4";
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `https://api.snowtrace.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${snowKey}`,
      );
      setData(result.data.result);
    };
    fetchData();
  }, [account]);

  return (
    <div>
      <div>Recent Transactions</div>
      <table
        style={{
          border: "2px solid #d9cbc2",
          width: "100%",
          padding: "5px",
        }}
      >
        <thead>
          <tr>
            <th>Hash</th>
            <th>From</th>
            <th>To</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.hash}>
              <td>{item.hash.slice(0, 10)}</td>
              <td>{item.from.slice(0, 10)}</td>
              <td>{item.to.slice(0, 10)}</td>
              <td>{ethers.utils.formatEther(item.value).slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletActivity;

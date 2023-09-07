import React, { useEffect, useState } from "react";
import DateFormater from "./dateFormater";
import {
  nftAddress,
  nftMarketplaceAddress,
} from "contracts/config/mainnet/networkAddress";
import { ethers } from "ethers";
import NFT from "../../contracts/NFT.json";
import Marketplace from "../../contracts/Marketplace.json";

export const NftHistoryTable = () => {
  // history state
  const [history, setHistory] = useState(null);

  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.avax.network/ext/bc/C/rpc",
  );

  const fetchNftHistory = async () => {
    try {
      const contract = new ethers.Contract(nftAddress, NFT.abi, provider);
      let eventFilter = contract.filters.Transfer();
      let events = await contract.queryFilter(eventFilter, 24861042, "latest"); //not working if I specify blocks
      console.log(events);
      setHistory(events.result);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchNftHistory();
  }, [nftAddress]);

  return (
    <div className="relative w-full overflow-y-scroll shadow-md h-80 sm:rounded-lg">
      {history ? (
        <table style={{ color: "black" }}>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                From
              </th>
              <th scope="col" className="px-6 py-3">
                Value
              </th>
              <th scope="col" className="px-6 py-3">
                To
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map(
                (
                  { from_address, value, to_address, block_timestamp },
                  index,
                ) => {
                  return (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-600 hover:text-white dark:hover:bg-gray-600"
                      key={index}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-black whitespace-nowrap">
                        {from_address.substring(0, 10)}...
                        {from_address.substring(12, 18)}
                      </td>
                      <td className="px-6 py-4">{value}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-black whitespace-nowrap">
                        {to_address.substring(0, 10)}...
                        {to_address.substring(12, 18)}
                      </td>
                      <td className="px-6 py-4">
                        {DateFormater.yearMonthDate(block_timestamp)}
                      </td>
                    </tr>
                  );
                },
              )
            ) : (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 dark:text-black whitespace-nowrap"
                  colSpan={4}
                >
                  No History Found
                </th>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="p-5 text-center text-gray-500 dark:text-gray-400">
          Loading histories...
        </div>
      )}
    </div>
  );
};

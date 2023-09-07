import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table } from 'antd'

export default function TopMetals() {
  const [palladiumPrice, setPalladiumPrice] = useState(null)
  const [iridiumPrice, setIridiumPrice] = useState(null)
  const [rhodiumPrice, setRhodiumPrice] = useState(null)
  const [xpdTimestamp, setXpdTimestamp] = useState(); //pallidium
  const [rhdTimestamp, setRhdTimestamp] = useState(); //rhodium
  const [irdTimestamp, setIrdTimestamp] = useState() //iridium



  const columns = [
    {
      title: 'Asset Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Asset Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
        title: 'Timestamp',
        dataIndex: 'timestamp',
        key: 'timestamp',
      },
  ]

  const data = [
    {
      key: '1',
      name: 'Palladium',
      timestamp: xpdTimestamp ? `${xpdTimestamp}` : 'Loading...',
      price: palladiumPrice ? `$${palladiumPrice.toFixed(2)}` : 'Loading...',
    },
    {
      key: '1',
      name: 'Rhodium',
      timestamp: rhdTimestamp ? `${rhdTimestamp}` : 'Loading....',
      price: rhodiumPrice ? `$${rhodiumPrice.toFixed(2)}` : 'Loading...',
    },
    {
      key: '1',
      name: 'Iridium',
      timestamp: irdTimestamp ? `${irdTimestamp}` : 'Loading...',
      price: iridiumPrice ? `$${iridiumPrice.toFixed(2)}` : 'Loading...',
    },
  ]

  useEffect(() => {
    axios
      .get(
        'https://metals-api.com/api/latest?access_key=jq8aan9o4e2oq295fkbxdjs4s0d295yt7q1i3vikhgb83rpg1ykmdpfb3rtf&base=USD&symbols=XRH'
      )
      .then((response) => {
        setRhodiumPrice(response.data.rates.USDXRH)
        const timestamp = response.data.timestamp;
        const date = new Date(timestamp * 1000);
        setRhdTimestamp(date.toString())
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    axios
      .get(
        'https://metals-api.com/api/latest?access_key=jq8aan9o4e2oq295fkbxdjs4s0d295yt7q1i3vikhgb83rpg1ykmdpfb3rtf&base=USD&symbols=XPD'
      )
      .then((response) => {
        setPalladiumPrice(response.data.rates.USDXPD)
        const timestamp = response.data.timestamp;
        const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
        
        setXpdTimestamp(date.toString());

      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    axios
      .get(
        'https://metals-api.com/api/latest?access_key=jq8aan9o4e2oq295fkbxdjs4s0d295yt7q1i3vikhgb83rpg1ykmdpfb3rtf&base=USD&symbols=IRD'
      )
      .then((response) => {
        setIridiumPrice(response.data.rates.USDIRD)
        const timestamp = response.data.timestamp;
        const date = new Date(timestamp * 1000);
        setIrdTimestamp(date.toString())
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return <Table columns={columns} dataSource={data} />
}

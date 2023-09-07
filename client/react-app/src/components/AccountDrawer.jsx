import { CouponOutline } from 'antd-mobile-icons'

import { Button, Drawer } from 'antd'
import React, { useState } from 'react'
import { MenuFoldOutlined } from '@ant-design/icons'
import { Box } from '@chakra-ui/react'
import { AutoCenter, SafeArea, TabBar } from 'antd-mobile'
//import { Box } from "demos";
import { Link } from '@chakra-ui/react'
import { AppOutline, ShopbagOutline,  UserOutline } from 'antd-mobile-icons'
import AccountDrawerLayout from './AccountDrawerLayout'


const AccountDrawer = () => {
  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button shape="circle" size="large" style={{marginTop:'13px', border:'3px solid #ad8897',backgroundColor:'#c6f8f7'}}  onClick={showDrawer}  icon={<MenuFoldOutlined />}></Button>

      <Drawer
        bodyStyle={{
          //backgroundColor: "#1F2937",
          padding: '2px',
          //width: '375px',
          backgroundColor: '#83a0a6',
          paddingTop: '0px',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}
        headerStyle={{
          textAlign: 'left',
          color: 'black',
          padding: '5px',
          //borderBottom: '3px solid #d3db92',
          //marginBottom: '-5px',
          marginTop: '-4px',
        }}
        title={[
          <>
            <TabBar>
              <TabBar.Item
                key="/home"
                icon={
                  <Link color="black" href="https://buny.cloud/">
                    <AppOutline style={{ fontSize: '20px' }} />
                  </Link>
                }
                title={[
                  <Link color="black" href="https://buny.cloud/">
                    Home
                  </Link>,
                ]}
              />
              <TabBar.Item
                key="/dashboard"
                icon={
                  <Link color="black" href="https://buny.cloud/dashboard">
                    <UserOutline style={{ fontSize: '20px' }} />
                  </Link>
                }
                title={[
                  <Link color="black" href="https://buny.cloud/dashboard">
                    Dashboard
                  </Link>,
                ]}
              />
              <TabBar.Item
                key="/nft-marketplace"
                icon={
                  <Link color="black" href="https://buny.cloud/nft-marketplace">
                    <ShopbagOutline style={{ fontSize: '20px' }} />
                  </Link>
                }
                title={[
                  <Link color="black" href="https://buny.cloud/nft-marketplace">
                    Marketplace
                  </Link>,
                ]}
              />
              <TabBar.Item
                key="/raffle"
                icon={[
                  <Link color="black" href="https://buny.cloud/buny-raffle">
                    <CouponOutline style={{ fontSize: '20px' }} />
                  </Link>,
                ]}
                title={[
                  <Link color="black" href="https://buny.cloud/buny-raffle">
                    Raffle
                  </Link>,
                ]}
              />
           
            </TabBar>

         
          </>,
        ]}
        placement="right"
        width={360}
        closable={false}
        onClose={onClose}
        open={open}>
        <AutoCenter>
          
            <AccountDrawerLayout onClose={onClose} />
          
        </AutoCenter>
        <SafeArea position="bottom" />
      </Drawer>
    </div>
  )
}

export default AccountDrawer

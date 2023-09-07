import { CaretUpOutlined, ShoppingOutlined, DashboardOutlined, UploadOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { CouponOutline } from 'antd-mobile-icons'
import { NavBar, TabBar } from 'antd-mobile'
import { Route, Switch, useHistory, useLocation, MemoryRouter as Router } from 'react-router-dom'
import { AppOutline, HistogramOutline, QuestionCircleOutline } from 'antd-mobile-icons'
import { Box, Center, VStack } from '@chakra-ui/react'
import { Menu, Button, Image } from 'antd'
import { useEtherBalance, useEthers } from '@usedapp/core'
import ConnectButtonBeta from './UseDapp/ConnectButtonBeta'
import HelpLayout from './Layout/HelpLayout'
import ContractDropdown from './ContractDropdown'
import TelosRaffleEvents from './Events/TelosRaffleEvents'


const styles = {
  app: {
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    flex: '0',
    backgroundColor: 'white',
    //border: '3px solid #d3db92',
    marginTop: '4px',
    color: '#2d2a5d',
    //borderBottom: 'solid 4px black',
  },
  body: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto',
    overflowX: 'hidden',
    color: '#2d2a5d',
    //marginTop: '5px',
    width: '360px',
    //padding:'40px',
    marginBottom: '6px',
    border: '15px solid #514d5b',
    backgroundColor: 'white',
  },
  bottom: {
    flex: '0',
    //borderTop: 'solid 8px #d9cbc2',
  },
}

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  }
}

const items = [
  getItem(
    <Button
      type="primary"
      style={{ color: 'black', fontSize: '18px', backgroundColor: '#c6f8f7' }}
      block
      href="/dashboard">
      Dashboard
    </Button>,
    '1',
    <DashboardOutlined style={{ fontSize: '33px' }} />
  ),
  getItem(
    <Button
      type="primary"
      style={{ color: 'black', fontSize: '18px', backgroundColor: '#c6f8f7' }}
      block
      href="/nft-marketplace">
      Marketplace
    </Button>,
    '2',
    <ShoppingOutlined style={{ fontSize: '33px' }} />
  ),
  getItem(
    <Button
      type="primary"
      style={{ color: 'black', fontSize: '18px', backgroundColor: '#c6f8f7' }}
      block
      href="/raffle-directory">
      Raffle Directory
    </Button>,
    '3',
    <UploadOutlined style={{ fontSize: '33px' }} />
  ),

  getItem(
    <Button
      type="primary"
      style={{ color: 'black', fontSize: '18px', backgroundColor: '#c6f8f7' }}
      block
      href="/buny-raffle">
      Buny Raffle
    </Button>,
    '7',
    <CouponOutline style={{ fontSize: '33px' }} />
  ),

  getItem(
    <Button
      type="primary"
      style={{ color: 'black', fontSize: '18px', backgroundColor: '#c6f8f7' }}
      block
      href="/TheBunyProject">
      The Buny Project
    </Button>,
    '10',
    <CaretUpOutlined style={{ fontSize: '33px' }} />
  ),
]

const onClick = (e) => {
  console.log('click ', e)
}

const Bottom = () => {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const setRouteActive = (value) => {
    history.push(value)
  }
  const tabs = [
    {
      key: '/menu',
      title: 'Menu',
      icon: <AppOutline style={{ fontSize: '30px' }} />,
    },

    {
      key: '/events',
      title: 'Events',
      icon: <HistogramOutline style={{ fontSize: '30px' }} />,
    },
    {
      key: '/help',
      title: 'Help',
      icon: <QuestionCircleOutline style={{ fontSize: '30px' }} />,
    },
  ]
  return (
    <div
      style={{
        //backgroundColor: '#beead1',
        color: 'white',
      }}>
      <Box bg="white" w="100%">
        <TabBar activeKey={pathname} onChange={(value) => setRouteActive(value)}>
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </Box>
    </div>
  )
}
export default function AccountDrawerLayout({ onClose }) {
  const [myName, setMyName] = useState(null)
  const [myPublicKey, setMyPublicKey] = useState(null)
  const { activateBrowserWallet, deactivate, chainId, account } = useEthers()
  const userBalance = useEtherBalance(account)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [myContract, setMyContract] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <Router initialEntries={['/menu']}>
      <div style={styles.app}>
        <div style={styles.top}>
          <NavBar onBack={onClose}>
            <Center p={5} mt={5}>
              <ConnectButtonBeta />
            </Center>
          </NavBar>
        </div>


        <div style={styles.body}>
          <Switch>
            <Route exact path="/menu">
            <VStack>
            <Center>
          <Image preview={false} width={300} src="https://buny.us-southeast-1.linodeobjects.com/TheBunyProject-pink.png" />
        </Center>
              <ThisMenu />
              </VStack>
            </Route>

            <Route exact path="/events">
              <Activity />
            </Route>
            <Route exact path="/help">
              <HelpLayout />
            </Route>
          </Switch>
        </div>
        <div className={styles.bottom}>
          <Bottom />
        </div>
      </div>
    </Router>
  )
}
function ThisMenu() {
  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <Menu style={{ width: '100%', backgroundColor: 'transparent' }} onClick={onClick} mode="inline" items={items} />
    </div>
  )
}
const contractAddress = '0xEb8F757c66A966eF8F012b598ea27260fD536F0a';
function Activity() {
  return (
    <div>
    </div>
  )
}

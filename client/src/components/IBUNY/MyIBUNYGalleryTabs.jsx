

import React, { useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import FetchMyIBUNY from '../IBUNY/FetchMyIBUNY'
import FetchMyIBUNYMini from '../IBUNY/FetchMyIBUNYMini'
import FetchMyIBUNYLarge from './FetchMyIBUNYLarge'
import FetchMyIBUNYSmall from './FetchMyIBUNYSmall'

export default function MyIBUNYGalleryTabs({contractAddress, abi, refresh}){



    return(
        <>
            <Tabs isLazy>
  <TabList>
    <Tab>LG</Tab>
    <Tab>XL</Tab>
    <Tab>SM</Tab>
    <Tab>XS</Tab>
  </TabList>
  <TabPanels>
    {/* initially mounted */}
    <TabPanel>
    <FetchMyIBUNY contractAddress={contractAddress} abi={abi} refresh={refresh} />

    </TabPanel>

    <TabPanel>
        <FetchMyIBUNYLarge contractAddress={contractAddress} abi={abi} refresh={refresh} />
    </TabPanel>
    {/* initially not mounted */}
    <TabPanel>
      <FetchMyIBUNYSmall contractAddress={contractAddress} abi={abi} refresh={refresh} />
    </TabPanel>
    <TabPanel>
      <FetchMyIBUNYMini contractAddress={contractAddress} abi={abi} refresh={refresh} />
    </TabPanel>
  </TabPanels>
</Tabs>
        </>
    )
}
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { MetaMaskProvider } from '@metamask/sdk-react'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ChakraProvider>
      
        <BrowserRouter>
        <MetaMaskProvider
        debug={false}
        sdkOptions={{
          logging: {
            developerMode: false,
          },
                    getUniversalLink: true,
          checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
          dappMetadata: {
            name: 'The Buny Project',
            url: 'https://buny.cloud',
          },
        }}>
          <App />
          </MetaMaskProvider>
        </BrowserRouter>
      
    </ChakraProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

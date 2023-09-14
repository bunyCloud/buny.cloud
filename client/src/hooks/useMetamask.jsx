import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import MetaMaskOnboarding from '@metamask/onboarding'
import { formatBalance } from '../utils/formatMetamask'

const disconnectedState = { accounts: [], balance: '', chainId: '' }

const MetaMaskContext = createContext()

export const MetaMaskContextProvider = (props) => {
  const [hasProvider, setHasProvider] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const forwarderOrigin = 'https://buny.cloud'
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin })
  
  const clearError = () => setErrorMessage('')
  const [wallet, setWallet] = useState(disconnectedState)
  const _updateWallet = useCallback(async (providedAccounts) => {
    const accounts = providedAccounts || (await window.ethereum.request({ method: 'eth_accounts' }))

    if (accounts.length === 0) {
      setWallet(disconnectedState)
      return
    }

    const balance = formatBalance(
      await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      }),
    )
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    })

    setWallet({ accounts, balance, chainId })
  }, [])

  const updateWalletAndAccounts = useCallback(() => _updateWallet(), [_updateWallet])
  const updateWallet = useCallback((accounts) => _updateWallet(accounts), [_updateWallet])

  useEffect(() => {
    const getProvider = async () => {
        const provider = await detectEthereumProvider({ silent: true });
        setHasProvider(Boolean(provider));

        if (provider) {
            // Check for previously connected accounts
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                updateWallet(accounts);
            } else {
                updateWalletAndAccounts();
            }

            window.ethereum.on('accountsChanged', updateWallet);
            window.ethereum.on('chainChanged', updateWalletAndAccounts);
        } else {
            setErrorMessage("MetaMask or an Ethereum provider is not detected.");
            // Start the onboarding process if MetaMask is not installed
            if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
                onboarding.startOnboarding();
            }
        }
    };

    getProvider();

    // Cleanup listeners on component unmount
    return () => {
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', updateWallet);
            window.ethereum.removeListener('chainChanged', updateWalletAndAccounts);
        }
    };
}, [onboarding, updateWallet, updateWalletAndAccounts]);


  const connectMetaMask = async () => {
    setIsConnecting(true);
    
    if (!window.ethereum) {
      setErrorMessage("MetaMask or an Ethereum provider is not detected.");
      if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
        onboarding.startOnboarding();
      }
      setIsConnecting(false);
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      clearError();
      updateWallet(accounts);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setIsConnecting(false);
  };
  
  

  return (
    <MetaMaskContext.Provider
      value={{
        wallet,
        hasProvider,
        error: !!errorMessage,
        errorMessage,
        isConnecting,
        connectMetaMask,
        clearError,
      }}>
      {props.children}
    </MetaMaskContext.Provider>
  )
}

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext)
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a "MetaMaskContextProvider"')
  }
  return context
}

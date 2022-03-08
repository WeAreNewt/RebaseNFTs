import React, { useState, useMemo } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core';

export const MetaMaskContext = React.createContext(null)
export const injected = new InjectedConnector({ supportedChainIds: [31337] })

export const MetaMaskProvider = ({ children }) => {

    const { activate, account } = useWeb3React()
    
    const [isActive, setIsActive] = useState(false)

    // Connect to MetaMask wallet
    const connect = async () => {
        console.log('Connecting to MetaMask...')
        try {
            await activate(injected).then(() => {
                setIsActive(true)
            })
        } catch(error) {
            console.log('Error on connecting: ', error)
        }
    }

    const values = useMemo(
        () => ({
            isActive,
            account,
            connect,
        }),
        [isActive, account]
    )

    return <MetaMaskContext.Provider value={values}>{children}</MetaMaskContext.Provider>
}

export default function useMetaMask() {
    const context = React.useContext(MetaMaskContext)

    if (context === undefined) {
        throw new Error('useMetaMask hook must be used with a MetaMaskProvider component')
    }

return context
}
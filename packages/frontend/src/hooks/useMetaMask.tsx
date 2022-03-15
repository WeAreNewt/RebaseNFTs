import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core';


export const MetaMaskContext = React.createContext(null)
export const injected = new InjectedConnector({ supportedChainIds: [31337] })

export const MetaMaskProvider = ({ children }) => {

    const { activate, active } = useWeb3React()
    
    const [isActive, setIsActive] = useState<boolean>(false)
  
    //Check if connected to wallet
    const checkConnection = async () => {
        const isConnected = await injected.isAuthorized()
        if(isConnected){
            setIsActive(true)
            console.log('App is connected with MetaMask ', active)
        } else {
            setIsActive(false)
        }
    }

    useEffect(() => {
        checkConnection()
    }, [checkConnection])

    // Connect to MetaMask wallet
    const connect = async () => {     
        
        console.log('Connecting to MetaMask...')
        try {
            await activate(injected).then(() => {     
            })  
        } catch(error) {
            console.log('Error on connecting: ', error)
        }
    }

    const values = useMemo(
        () => ({
            isActive,
            connect
        }),
        [isActive, connect]
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
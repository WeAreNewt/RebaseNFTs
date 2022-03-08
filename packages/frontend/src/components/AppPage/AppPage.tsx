import { Permissions } from '^@services/permissions'
import { Web3ReactProvider } from '@web3-react/core'
import { MetaMaskProvider } from '../../hooks/useMetaMask'
import { ethers } from "ethers";

interface Props {
  permission: Permissions
}

function getLibrary(provider: any): ethers.providers.Web3Provider {
  return new ethers.providers.Web3Provider(provider);
}

export const AppPage = (PageComponent: React.FC, { permission }: Props) => {
  const Component = (props) => {
    /**
     * Check permission for page
     */
    const allowed = [Permissions.PUBLIC].includes(permission)

    /**
     * If not allowed, render nothing (@todo: or redirect)
     */
    if (!allowed) {
      return null
    }

    /**
     * Render page
     */       
    return  (
      
      <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <PageComponent {...props} />
      </MetaMaskProvider>
      </Web3ReactProvider>
        
      
            )
  }

  return Component
}

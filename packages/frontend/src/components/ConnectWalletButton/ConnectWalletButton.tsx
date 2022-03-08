import { Button } from '^@components'
import  useMetaMask  from '../../hooks/useMetaMask'

export const ConnectWalletButton: React.FC  = () => { 
    const { connect , isActive } = useMetaMask();

    return (
        <Button onClick={connect} disabled={isActive ? true : false} text={isActive ? "Connected" : "Connect wallet"} />
    )
}

import { useWeb3React } from "@web3-react/core"
import { Button } from '^@components'
import { injectedConnector } from "^@services/connector"

export const ConnectWalletButton = () => {
  const { active, activate, deactivate, error } = useWeb3React()

  async function connect() {
      try {
          await activate(injectedConnector)
      } catch (e) {
          console.error(e)
      }
  }

  async function disconnect() {
      try {
          deactivate()
      } catch (e) {
          console.log(e)
      }
  }

  return (
    <>
    {active ? (
      <Button onClick={disconnect} variant="secondary" text="Disconnect" />
    ) : (
      <Button onClick={connect} variant="primary" text={"Connect"}/>
    )}
    </>
  )
}

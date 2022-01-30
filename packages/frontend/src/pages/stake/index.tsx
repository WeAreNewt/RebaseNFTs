import { AppPage, Layout } from '^@components'
import { Permissions } from '^@services/permissions'

const Stake = () => (
  <Layout showConnectWallet>
    <div className="flex flex-col h-full relative">Stake</div>
  </Layout>
)

export default AppPage(Stake, { permission: Permissions.PUBLIC })

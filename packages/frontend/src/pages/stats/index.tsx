import { AppPage, Layout } from '^@components'
import { Permissions } from '^@services/permissions'

const Stats = () => (
  <Layout showConnectWallet>
    <div className="flex flex-col h-full relative">Stats</div>
  </Layout>
)

export default AppPage(Stats, { permission: Permissions.PUBLIC })

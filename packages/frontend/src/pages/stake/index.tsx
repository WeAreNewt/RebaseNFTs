import { AppPage, Heading, Layout } from '^@components'
import { Permissions } from '^@services/permissions'

const Stake = () => (
  <Layout showConnectWallet>
    <Heading text="Stake" />
  </Layout>
)

export default AppPage(Stake, { permission: Permissions.PUBLIC })

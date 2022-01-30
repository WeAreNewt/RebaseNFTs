import Image from 'next/image'
import { AppPage, Layout } from '^@components'
import { Permissions } from '^@services/permissions'

const Mint = () => (
  <Layout showConnectWallet>
    <div className="relative h-full w-full">
      <div className="absolute w-96 h-96">
        <Image src="/images/ricco-1.png" layout="fill" />
      </div>
    </div>
  </Layout>
)

export default AppPage(Mint, { permission: Permissions.PUBLIC })

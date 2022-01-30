import Image from 'next/image'
import { AppPage, Layout } from '^@components'
import { Permissions } from '^@services/permissions'

const Mint = () => (
  <Layout showConnectWallet>
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center">
        <Image src="/images/ricco-1.png" width={300} height={300} />
        <Image src="/images/ricco-2.png" width={300} height={300} />
      </div>
      <h1 className="text-6xl leading-none font-extrabold mb-4">
        Mint! It's free.
      </h1>
      <h2 className="text-4xl leading-10 font-normal">9990/9999 minted</h2>
    </div>
  </Layout>
)

export default AppPage(Mint, { permission: Permissions.PUBLIC })

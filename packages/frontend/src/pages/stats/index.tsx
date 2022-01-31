import { AppPage, Heading, Layout } from '^@components'
import { Permissions } from '^@services/permissions'

interface StatProps {
  title: string
  subHeader: string
}

const Stat = ({ title, subHeader }: StatProps) => (
  <div className="w-full h-28 bg-white rounded-lg flex flex-col p-6 justify-center">
    <h3 className="text-sm text-gray-500 leading-5 font-medium">{subHeader}</h3>
    <h2 className="text-3xl leading-9 font-semibold">{title}</h2>
  </div>
)

const Stats = () => (
  <Layout showConnectWallet>
    <Heading text="Stats" />
    <div className="grid grid-cols-3 gap-4 gap-y-8">
      <Stat subHeader="Total Collection Supply" title="20,000" />
      <Stat subHeader="Market Cap" title="123,456 AVAX" />
      <Stat subHeader="Floor Price" title="5.2 AVAX" />
      <Stat subHeader="Average APY" title="71,897%" />
      <Stat subHeader="Rabbits Staked Ratio" title="58.16%" />
      <Stat subHeader="Treasury Balance" title="0 AVAX" />
      <Stat subHeader="Runaway" title="20,000" />
      <Stat subHeader="RFV" title="0 AVAX" />
    </div>
  </Layout>
)

export default AppPage(Stats, { permission: Permissions.PUBLIC })

import { AppPage, Heading, Layout } from '^@components'
import { Permissions } from '^@services/permissions'

interface Props {
  text: string
  subText: string
}

const StakeItem = ({ text, subText }: Props) => (
  <div className="flex justify-between mb-2">
    <span className="text-lg leading-6 font-semibold">{text}</span>
    <span className="text-lg leading-6 font-normal text-gray-600">
      {subText}
    </span>
  </div>
)

const Stake = () => (
  <Layout showConnectWallet>
    <div className="w-full bg-gray-100 p-8 rounded">
      <Heading text="Stake" />
      <h3 className="text-xs leading-4 font-medium tracking-wider uppercase">
        7 HOURS 49 MINUTES TO NEXT REBASE
      </h3>

      <div className="flex justify-center">
        <span className="text-2xl mr-12">Stake</span>
        <span className="text-2xl">Unstake</span>
      </div>

      <span className="text-sm leading-5 font-normal text-gray-600 ">
        Note: The "Approve" transaction is only needed when staking/unstaking
        for the first time; subsequent staking/unstaking only requires you to
        perform the "Stake" or "Unstake" transaction.
      </span>

      <div className="mt-4">
        <StakeItem text="Your Balance" subText="0 Rabbit" />
        <StakeItem text="Your Staked Balance" subText="0 sRabbit" />
        <StakeItem text="Next Reward Amount" subText="0 Rabbit" />
        <StakeItem text="Your Reward Yield" subText="0.3447%" />
      </div>
    </div>
  </Layout>
)

export default AppPage(Stake, { permission: Permissions.PUBLIC })

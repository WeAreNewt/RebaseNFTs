import { Button } from 'components/Button/Button'
import { useState } from 'react'
import { AppPage, Heading, MoneyInput, Layout } from '^@components'
import { Permissions } from '^@services/permissions'
import { StakeItem, TabItem } from 'components/pages/stake'

/**
 * Tab state
 */
enum Tab {
  stake,
  unstake,
}

const Stake = () => {
  const [tab, setTab] = useState<Tab>(Tab.stake)
  const [value, setValue] = useState<number | null>(null)

  return (
    <Layout showConnectWallet>
      <div className="flex flex-col w-full bg-gray-100 p-8 rounded">
        <Heading text="Stake" />
        <h3 className="text-xs leading-4 font-medium tracking-wider uppercase">
          7 HOURS 49 MINUTES TO NEXT REBASE
        </h3>

        <div className="flex justify-center mb-4">
          <TabItem onClick={() => setTab(Tab.stake)} active={tab === Tab.stake}>
            Stake
          </TabItem>
          <TabItem
            onClick={() => setTab(Tab.unstake)}
            active={tab === Tab.unstake}
          >
            Unstake
          </TabItem>
        </div>

        <div className="flex">
          <MoneyInput
            max={1000}
            value={value}
            className="flex-1 mr-4"
            onInputChange={(number) => setValue(number)}
          />
          <Button text="Approve" height="h-full" disabled={!value} />
        </div>

        <span className="text-sm leading-5 font-normal text-gray-600 mt-2">
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
}

export default AppPage(Stake, { permission: Permissions.PUBLIC })

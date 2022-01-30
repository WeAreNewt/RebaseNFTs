import { Icon } from '^@components'
import * as routes from '^@services/routes'
import { useRouter } from 'next/router'
import {
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FolderIcon,
} from '@heroicons/react/outline'
import cn from 'classnames'
import Link from 'next/link'

interface ItemProps {
  children: React.ReactNode
  active?: boolean
  href: string
}

const Item = ({ href, active = false, children }: ItemProps) => (
  <Link href={href}>
    <li
      className={cn(
        'flex py-2 rounded-lg mb-2 px-2 cursor-pointer fill-white hover:text-slate-800 hover:fill-slate-800',
        {
          'bg-black hover:text-white': active,
        }
      )}
    >
      {children}
    </li>
  </Link>
)

export const Sidebar = () => {
  const router = useRouter()

  return (
    <div className="flex flex-col w-80 bg-light-pink-700 px-2 pt-2 text-white">
      <div className="flex items-center font-bold p-4">
        <Icon name="Rabbit" size={32} />
        <span className="ml-2">Rabbits</span>
      </div>
      <ol className="mt-3">
        <Item href={routes.stake} active={router.asPath === routes.stake}>
          <HomeIcon className="w-6 h-6 mr-2" /> Stake
        </Item>
        <Item href={routes.mint} active={router.asPath === routes.mint}>
          <UsersIcon className="w-6 h-6 mr-2" /> Mint
        </Item>
        <Item href={routes.buy} active={router.asPath === routes.buy}>
          <CurrencyDollarIcon className="w-6 h-6 mr-2" /> Buy
        </Item>
        <Item href={routes.bridge} active={router.asPath === routes.bridge}>
          <Icon name="Bridge" className="w-6 h-6 mr-2" /> Bridge
        </Item>
        <Item href={routes.stats} active={router.asPath === routes.stats}>
          <ChartBarIcon className="w-6 h-6 mr-2" /> Stats
        </Item>
        <Item href={routes.docs} active={router.asPath === routes.docs}>
          <FolderIcon className="w-6 h-6 mr-2" /> Docs
        </Item>
      </ol>
    </div>
  )
}

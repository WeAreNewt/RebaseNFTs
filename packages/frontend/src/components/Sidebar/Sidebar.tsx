import { Icon } from '^@components'
import * as routes from '^@services/routes'
import { useRouter } from 'next/router'
import {
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FolderIcon,
  ArrowSmRightIcon,
} from '@heroicons/react/outline'
import cn from 'classnames'
import Link from 'next/link'

interface ItemProps {
  children: React.ReactNode
  href: string
  newTab?: boolean
}

const Item = ({ href, newTab = false, children }: ItemProps) => {
  const router = useRouter()
  const active = router.asPath === href

  return (
    <Link href={href} passHref>
      <a target={cn({ _blank: newTab })}>
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
      </a>
    </Link>
  )
}

export const Sidebar = () => (
  <div className="flex flex-col w-80 bg-light-pink-700 px-2 pt-2 text-white">
    <Link href="/">
      <div className="flex items-center font-bold p-4 cursor-pointer">
        <Icon name="Rabbit" size={32} />
        <span className="ml-2">Rabbits</span>
      </div>
    </Link>
    <ol className="mt-3">
      <Item href={routes.stake}>
        <HomeIcon className="w-6 h-6 mr-2" /> Stake
      </Item>
      <Item href={routes.mint}>
        <UsersIcon className="w-6 h-6 mr-2" /> Mint
      </Item>
      <Item href="https://bridge.avax.network/" newTab>
        <CurrencyDollarIcon className="w-6 h-6 mr-2" /> Buy{' '}
        <ArrowSmRightIcon className="w-5 h-5 -rotate-45" />
      </Item>
      <Item href="https://bridge.avax.network/" newTab>
        <Icon name="Bridge" className="w-6 h-6 mr-2" /> Bridge{' '}
        <ArrowSmRightIcon className="w-5 h-5 -rotate-45" />
      </Item>
      <Item href={routes.stats}>
        <ChartBarIcon className="w-6 h-6 mr-2" /> Stats
      </Item>
      <Item href={routes.docs}>
        <FolderIcon className="w-6 h-6 mr-2" /> Docs
      </Item>
    </ol>
  </div>
)

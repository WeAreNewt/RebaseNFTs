import { ConnectWallet, Header, Sidebar } from '^@components'
import cn from 'classnames'
interface Props {
  /**
   * hide the sidebar
   */
  hideSidebar?: boolean
  showConnectWallet?: boolean
  children: React.ReactNode
}

export const Layout = ({
  hideSidebar = false,
  showConnectWallet = false,
  children,
}: Props) => (
  <div
    className={cn('flex h-screen', {
      'flex-col': hideSidebar,
    })}
  >
    {!hideSidebar ? <Sidebar /> : <Header />}

    <div className="flex flex-col mt-2 flex-1">
      {showConnectWallet && <ConnectWallet />}
      <main className="px-4 flex flex-col flex-1">{children}</main>
    </div>
  </div>
)

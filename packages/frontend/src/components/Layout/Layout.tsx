import { Header } from '^@components'

interface Props {
  children: React.ReactNode
}

export const Layout = ({ children }: Props) => (
  <div className="flex flex-col h-screen">
    <Header />

    <div className="flex mt-2 flex-1">
      {/* <div className="flex w-80"></div> */}
      <main className="px-4 flex flex-col flex-1">{children}</main>
    </div>
  </div>
)

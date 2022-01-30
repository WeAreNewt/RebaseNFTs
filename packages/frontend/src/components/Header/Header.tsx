import { Icon } from '^@components'

export const Header = () => (
  <div className="flex justify-between px-6 py-2">
    <div className="flex">
      <Icon name="Rabbit" size={32} />
    </div>
    <nav className="mr-10">
      <ol className="flex text-white items-center h-full">
        <li className="px-2 ml-2">Item One</li>
        <li className="px-2 ml-2">Item Two</li>
        <li className="px-2 ml-2">Item Three</li>
      </ol>
    </nav>
  </div>
)

import { Icon } from '^@components'

export const Header = () => (
  <div className="flex justify-between px-6 py-2">
    <div className="flex p-4">
      <Icon name="Rabbit" size={32} />
    </div>
    <nav className="mr-10">
      <ol className="flex text-white items-center h-full p-4">
        <li className="px-2 ml-2"><a href="https://github.com/WeAreNewt/RebaseNFTs/" target="_blank">Github</a></li>
        <li className="px-2 ml-2"><a href="https://snowtrace.io/" target="_blank">Snowtrace</a></li>
        <li className="px-2 ml-2">Twitter</li>
        <li className="px-2 ml-2">Discord</li>
      </ol>
    </nav>
  </div>
)

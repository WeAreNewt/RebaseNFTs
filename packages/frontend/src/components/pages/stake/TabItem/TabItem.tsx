import cn from 'classnames'

interface TabItemProps {
  /**
   * tab is active
   */
  active: boolean
  /**
   * handle tab onClick
   */
  onClick: () => void
  /**
   * children/tab title
   */
  children: React.ReactNode
}

export const TabItem = ({ active, onClick, children }: TabItemProps) => (
  <div
    role="tab"
    className={cn(
      'text-2xl mr-12 underline-offset-2 cursor-pointer hover:text-gray-700',
      {
        underline: active,
      }
    )}
    onClick={onClick}
  >
    {children}
  </div>
)

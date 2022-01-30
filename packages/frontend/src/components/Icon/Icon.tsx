import { Icons } from './icons'

export interface Props extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Icon name
   */
  name: keyof typeof Icons
  /**
   * Size of icon
   */
  size?: number
}

export const Icon = ({ name, size = 25, ...props }: Props) => {
  const NamedIcon = Icons[name]

  return <NamedIcon width={size} height={size} {...props} role="img" />
}

import cn from 'classnames'
import { Icon } from '^@components'

enum Variants {
  primary = 'primary',
  secondary = 'secondary',
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  text: string
  loading?: boolean
  variant?: `${Variants}`
  height?: string
}

export const Button = ({
  className,
  loading = false,
  text,
  variant = Variants.primary,
  height = 'h-12',
  disabled,
  ...props
}: Props) => (
  <>
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'rounded-md px-2 py-4 w-36 flex justify-center items-center cursor-pointer disabled:opacity-50 transition-all ease-in-out duration-300',
        {
          'bg-dark-pink-100 text-white hover:bg-light-pink-700':
            variant === Variants.primary,
          'bg-white text-zinc-800 hover:bg-zinc-200':
            variant === Variants.secondary,
        },
        height,
        className
      )}
    >
      <span className={cn({ hidden: loading })}>{text}</span>
      {loading && <Icon name="Spinner" className="animate-spin ml-2" />}
    </button>
  </>
)

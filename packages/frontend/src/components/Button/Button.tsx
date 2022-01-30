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
}

export const Button = ({
  className,
  loading = false,
  text,
  variant = Variants.primary,
  ...props
}: Props) => (
  <>
    <button
      {...props}
      disabled={loading}
      className={cn(
        'rounded-md px-2 py-4 w-36 h-12 flex justify-center items-center cursor-pointer disabled:opacity-50',
        {
          'bg-dark-pink-100 text-white hover:bg-light-pink-700':
            variant === Variants.primary,
          'bg-white text-zinc-800 hover:bg-zinc-200':
            variant === Variants.secondary,
        },
        className
      )}
    >
      {text}
      {loading && <Icon name="Spinner" className="animate-spin ml-2" />}
    </button>
  </>
)

import cn from 'classnames'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input = ({ className }: Props) => (
  <div className={cn('relative', className)}>
    <input
      className={cn(
        'border rounded-lg border-zinc-900 bg-transparent pl-4 pr-12 py-4 w-full'
      )}
    />
    <span className="absolute right-4 top-4">MAX</span>
  </div>
)

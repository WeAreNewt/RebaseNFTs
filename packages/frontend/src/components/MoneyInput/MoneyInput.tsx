import cn from 'classnames'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * custom class names
   */
  className?: string
  /**
   * max input value
   */
  max?: number
  /**
   * on change handler
   */
  onInputChange?: (value: number | null) => void
}

export const MoneyInput = ({ className, value, max, onInputChange }: Props) => (
  <div className={cn('relative', className)}>
    <input
      className={cn(
        'border rounded-lg border-zinc-900 bg-transparent pl-4 pr-12 py-4 w-full'
      )}
      type="number"
      min={0}
      max={max}
      value={value || ''}
      onChange={(e) => onInputChange(Number(e.target.value) || null)}
    />
    <span
      role="button"
      className="absolute right-4 top-4 cursor-pointer select-none"
      onClick={() => onInputChange(max)}
    >
      MAX
    </span>
  </div>
)

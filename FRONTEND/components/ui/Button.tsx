type ButtonProps = {
  variant?:  'primary' | 'secondary' | 'ghost' | 'danger' | 'semi'
  children:  React.ReactNode
  onClick?:  () => void
  disabled?: boolean
  type?:     'button' | 'submit' | 'reset'
  className?: string
}

export default function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  type = 'button',
  className = '',
}: ButtonProps) {
  const styles: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:   'bg-primary text-white hover:bg-primary-dark hover:shadow-md',
    secondary: 'bg-white text-primary hover:bg-zinc-100',
    ghost:     'bg-transparent border border-border-main text-text hover:bg-bg',
    semi:      'bg-transparent border border-border-main text-text hover:bg-white',
    danger:    'bg-red-600 text-white hover:bg-red-500',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm',
        'transition-all active:scale-95 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        styles[variant],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}

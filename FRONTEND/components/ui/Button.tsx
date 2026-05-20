type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  children: React.ReactNode
  onClick?: () => void
}

export default function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  const styles = {
    primary:   'bg-primary text-white hover:bg-primary-dark active:scale-95 cursor-pointer transition-all hover:shadow-md',
    secondary: 'bg-white text-primary hover:bg-zinc-100 active:scale-95 cursor-pointer transition-all',
    ghost:     'bg-transparent border border-border-main text-text hover:bg-bg active:scale-95 cursor-pointer transition-all',
    semi:     'bg-transparent border border-border-main text-text hover:bg-white active:scale-95 cursor-pointer transition-all',
    danger:    'bg-red-600 text-white hover:bg-red-500 active:scale-95 cursor-pointer transition-all',
  }

  return (
    <button onClick={onClick} className={`px-5 py-2 rounded-md font-semibold text-sm ${styles[variant]}`}>
      {children}
    </button>
  )
}
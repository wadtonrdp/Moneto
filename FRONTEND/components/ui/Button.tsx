// components/ui/Button.tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  children: React.ReactNode
  onClick?: () => void
}

export default function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  const styles = {
    primary: 'bg-[#0F6E56] text-white hover:bg-[#0D5A45] cursor-pointer',
    secondary: 'bg-white text-zinc-800 hover:bg-zinc-300 text-[#0F6E56] cursor-pointer',
    ghost:   'bg-transparent border border-zinc-300 text-zinc-800 hover:bg-zinc-200 cursor-pointer',
    danger:  'bg-red-600 text-white hover:bg-red-500 cursor-pointer',
  }

  return (
    <button onClick={onClick} className={`px-5 py-2 rounded-md font-semibold text-sm ${styles[variant]}`}>
      {children}
    </button>
  )
}
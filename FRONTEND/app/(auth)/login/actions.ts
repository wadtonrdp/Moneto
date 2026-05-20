export function loginActionLocal(formData: FormData): boolean {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const demoFlag = formData.get('demo') as string

  const isDemo = (email === 'demo@moneto.app' && password === 'demo123') || demoFlag === 'true'

  return isDemo
}
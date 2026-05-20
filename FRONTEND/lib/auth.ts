const DEMO_EMAIL = 'demo@moneto.app'
const DEMO_PASSWORD = 'demo123'

export function loginDemo(email?: string, password?: string, isDemoDirect?: boolean): boolean {
  // Permite login tanto clicando no botão "Entrar como demo" quanto digitando no formulário
  if (isDemoDirect || (email === DEMO_EMAIL && password === DEMO_PASSWORD)) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('moneto_authenticated', 'true')
    }
    return true
  }
  return false
}

export function logoutDemo() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('moneto_authenticated')
  }
}

export function checkAuth(): boolean {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('moneto_authenticated') === 'true'
  }
  return false
}
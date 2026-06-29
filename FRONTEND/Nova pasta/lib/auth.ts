export function checkAuth(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('moneto_session') === 'demo'
}

export function doLogin() {
  sessionStorage.setItem('moneto_session', 'demo')
}

export function doLogout() {
  sessionStorage.removeItem('moneto_session')
}
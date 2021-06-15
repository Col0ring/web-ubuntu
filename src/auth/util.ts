const authKey = 'web-ubuntu-auth-key'

export function setToken(token: string) {
  localStorage.setItem(authKey, token)
}

export function getToken() {
  return localStorage.getItem(authKey)
}

export function removeToken() {
  localStorage.removeItem(authKey)
}

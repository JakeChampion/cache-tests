export let useBrowserCache = false
export let baseUrl = ''
export let destination = ''
export const requestTimeout = 10 // seconds

export function setUseBrowserCache (bool) {
  if (bool !== undefined) useBrowserCache = bool
}

export function setBaseUrl (url) {
  if (url !== undefined) baseUrl = url
}

export function connectTo (dest) {
  if (dest !== undefined) destination = dest
}

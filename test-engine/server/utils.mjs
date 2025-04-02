import { BLUE, NC } from '../lib/defines.mjs'

/**
 * @param {typeof import('http').ServerResponse} response
 * @param {number} statusCode
 * @param {string} message
 */
export function sendResponse (response, statusCode, message) {
  console.warn(`SERVER WARNING: ${message}`)
  response.writeHead(statusCode, { 'Content-Type': 'text/plain' })
  response.write(`${message}\n`)
  response.end()
}

export function getHeader (headers, headerName) {
  let result
  headers.forEach(header => {
    if (header[0].toLowerCase() === headerName.toLowerCase()) {
      result = header[1]
    }
  })
  return result
}

// stash for server state
export const stash = new Map()

export function setStash (key, value) {
  stash.set(key, value)
}

// configurations
export const configs = new Map()

export function setConfig (key, value) {
  configs.set(key, value)
}

export function logRequest (request, reqNum) {
  console.warn(`${BLUE}=== Server request ${reqNum}${NC}`)
  console.warn(`    ${request.method} ${request.url}`)
  for (const [key, value] of Object.entries(request.headers)) {
    console.warn(`    ${key}: ${value}`)
  }
  console.warn('')
}

export function logResponse (response, resNum) {
  console.warn(`${BLUE}=== Server response ${resNum}${NC}`)
  if (response === 'disconnect') {
    console.warn('    [ server disconnect ]')
  } else {
    console.warn(`    HTTP ${response.statusCode} ${response.statusPhrase}`)
    for (const [key, value] of Object.entries(response.getHeaders())) {
      console.warn(`    ${key}: ${value}`)
    }
  }
  console.warn('')
}

/**
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export default async (req) => {
  const url = new URL(req.url)
  url.host = 'cache-tests-x98l3.ondigitalocean.app'
  url.port = 443
  url.protocol = 'https'
  req.headers.set('accept-encoding', 'identity')
  const rreeqq = new Request(url, req)
  rreeqq.headers.set('host', url.host)
  const response = await fetch(rreeqq)
  return response
}

export const config = {
  path: '/*'
}

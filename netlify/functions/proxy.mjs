/**
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export default async (req) => {
  const url = new URL(req.url)
  url.host = 'c8koc4ks0wkokgckoo8gck0o.164.90.159.101.sslip.io'
  url.port = 80
  url.protocol = 'http'
  const rreeqq = new Request(url, req)
  rreeqq.headers.set('host', url.host)
  rreeqq.headers.set('accept-encoding', 'none')
  console.log('accept-encoding:',rreeqq.headers.get('accept-encoding'))
  const response = await fetch(rreeqq)
  console.log('content-encoding:',response.headers.get('content-encoding'))
  return response
}

export const config = {
  path: '/*'
}

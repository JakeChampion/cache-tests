
/**
 * 
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 */
export async function GET(req) {

  const targetUrl = new URL(`http://cache-tests.jakechampion.name${new URL(req.url).pathname}`);
  try {
    const response = await fetch(targetUrl, req);
    return response
  } catch (error) {
    console.error("Error during proxying:", error);
    return new Response('Internal Server Error', { status: 500 })
  }
}
export const PUT = GET
export const HEAD = GET
export const POST = GET
export const DELETE = GET
export const OPTIONS = GET
export const TRACE = GET
export const CONNECT = GET
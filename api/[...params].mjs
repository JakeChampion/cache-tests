import fetch from 'node-fetch';

/**
 * 
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 */
export default async function handler(req, res) {
  const targetUrl = new URL(`http://cache-tests.jakechampion.name${req.url}`); // Target website URL

  try {
    delete req.headers.host
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method === 'POST' || req.method === 'PUT' ? req : null,
      duplex: "half"
    });

    res.status(response.status);

    response.headers.forEach((value, name) => {
      res.setHeader(name, value);
    });

    response.body.pipe(res)
  } catch (error) {
    Object.keys(res.getHeaders()).forEach(header => {
      res.removeHeader(header);
    });
    console.error("Error during proxying:", error);
    res.status(500).send("Internal Server Error");
  }
}

export default function handler(req, res) {
    // Get the HTTP method and the path of the request
    const method = req.method;
    const path = req.url;

    // Log or process the request
    console.log(`Received ${method} request to ${path}`);

    // You can handle the request however you like
    res.status(200).json({
        message: `You made a ${method} request to ${path}`,
    });
}
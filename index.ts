const path = require('path');

Bun.serve({
    hostname:'localhost',
    port: 8080,
    fetch: handler,
});

console.log('Server running at http://localhost:8080/');

const BASE_PATH = './public';

function handler(request: Request): Response {
    const url = new URL(request.url);
    console.log(url);
    let filePath = BASE_PATH;
    if (url.pathname === '/') {
        filePath = path.join(filePath, '/index.html');
    }
    else {
        filePath = path.join(filePath, url.pathname);
    }

    
    console.log('filePath:', filePath);
    const file = Bun.file(filePath);
    return new Response(file);
}

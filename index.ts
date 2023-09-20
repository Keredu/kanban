Bun.serve({
    hostname:'localhost',
    port: 8080,
    fetch: handler,
})

const BASE_PATH = './public';

function handler(request: Request): Response {
    const filePath = BASE_PATH + new URL(request.url).pathname;
    console.log(filePath);
    const file = Bun.file(filePath);
    return new Response(file);
}

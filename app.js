import http from 'http';
import controller from './controller.js';
import { getReqData } from './utils.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const headers = {
        'Content-Type': 'application/json'
      };

    const cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
        'Access-Control-Max-Age': 2592000,
        'Access-Control-Allow-Headers': '*'
    }
    // /item : GET
    if ((req.url === "/item/" || req.url === "/column/") && req.method === "GET") {
        const mode = req.url.split("/")[1];
        const todos = await new controller().getItems(mode);
        res.writeHead(200, headers);
        res.end(JSON.stringify(todos));
    }

    else if (req.url.match(/\/item\/([0-9]+)\/column/) && req.method === "GET") {
        try {
            const mode = req.url.split("/")[1];
            const id = req.url.split("/")[2];
            const todo = await new controller().getItemByColumnId(id, mode);
            res.writeHead(200, headers);
            res.end(JSON.stringify(todo));
        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    }

    // /item/:id : GET
    else if ((req.url.match(/\/item\/([0-9]+)/) || req.url.match(/\/column\/([0-9]+)/)) && req.method === "GET") {
        try {
            const mode = req.url.split("/")[1];
            const id = req.url.split("/")[2];
            const todo = await new controller().getItem(id, mode);
            res.writeHead(200, headers);
            res.end(JSON.stringify(todo));
        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    }

    // /item/:id  : DELETE
    else if (req.url.match(/\/item\/([0-9]+)/) && req.method === "DELETE") {
        try {
            const mode = req.url.split("/")[1];
            const id = req.url.split("/")[2];
            let message = await new controller().deleteItem(id, mode);
            res.writeHead(200, headers);
            res.end(JSON.stringify({ message }));
        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    }
    
    else if (req.url === "/item/" && req.method === "POST") {
        const mode = req.url.split("/")[1];
        let todo_data = await getReqData(req);
        let todo = await new controller().createItem(JSON.parse(todo_data), mode);
        let last_todo = await new controller().getLastItem(mode);
        res.writeHead(200, headers);
        res.end(JSON.stringify(last_todo));
    }

    // /item/:id : UPDATE
    else if (req.url.match(/\/item\/([0-9]+)/) && req.method === "PUT") {
        try {
            const mode = req.url.split("/")[1];
            const id = req.url.split("/")[2];
            let update_data = await getReqData(req);
            let updated_todo = await new controller().updateItem(id, JSON.parse(update_data), mode);
            res.writeHead(200, headers);
            res.end(JSON.stringify(updated_todo));
        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    }

    else if (req.method === "OPTIONS") {
        try{
            res.writeHead(200, cors_headers);
            res.end();
        } catch (error) {
            res.writeHead(404, {});
            res.end(JSON.stringify({ message: error }));
        }
        
    }

    // /api/todos/ : POST

    // No route present
    else {
        res.writeHead(404, { "Content-Type": "application/json","Access-Control-Allow-Origin": "*"  });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});
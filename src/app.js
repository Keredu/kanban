import http from 'http';
import controller from './controller.js';
import { getReqData } from './utils.js';

const PORT = process.env.PORT || 5000;


const server = http.createServer(async (req, res) => {

    function response(body){
        try{
            res.writeHead(200, headers);
            res.end(JSON.stringify(body));
        } catch (error) {
            res.writeHead(404, headers);
            res.end(JSON.stringify({ message: error }));
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      };

    const cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
        'Access-Control-Max-Age': 2592000,
        'Access-Control-Allow-Headers': '*'
    }

    
    // /item : GET or /column : GET - returns all the items
    if (req.url.match("^/(?:column|item)/$") && req.method === "GET"){
        const mode = req.url.split("/")[1];
        const sql = await new controller().getItems(mode);
        response(sql);
    // /item/:id : GET or /column/:id : GET - returns an item given its id
    } else if (req.url.match("^/(?:column|item)/([0-9]+)$") && req.method === "GET"){
        const mode = req.url.split("/")[1];
        const id = req.url.split("/")[2];
        const sql = await new controller().getItem(id, mode);
        response(sql);
    // /item/:id/column : GET - returns an item given its column id
    } else if (req.url.match("^/item/([0-9]+)/column/$") && req.method === "GET"){
        const mode = req.url.split("/")[1];
        const id = req.url.split("/")[2];
        const sql = await new controller().getItemByColumnId(id, mode);
        response(sql);
    // /item : POST or /column : POST - creates an item
    } else if (req.url.match("^/(?:column|item)/$") && req.method === "POST"){
        const mode = req.url.split("/")[1];
        const body = await getReqData(req);
        const sql = await new controller().createItem(JSON.parse(body), mode);
        response(sql);
    // /item/:id : PUT or /column/:id : PUT - updates an item
    } else if (req.url.match("^/(?:column|item)/([0-9]+)$") && req.method === "PUT"){
        const mode = req.url.split("/")[1];
        const id = req.url.split("/")[2];
        const body = await getReqData(req);
        const sql = await new controller().updateItem(id, JSON.parse(body), mode);
        response(sql);
    // /item/:id : DELETE or /column/:id : DELETE - deletes an item
    } else if (req.url.match("^/(?:column|item)/([0-9]+)$") && req.method === "DELETE"){
        const mode = req.url.split("/")[1];
        const id = req.url.split("/")[2];
        const sql = await new controller().deleteItem(id, mode);
        response(sql);
    // CORS OPTIONS
    } else if (req.method === "OPTIONS"){
        try{
            res.writeHead(200, cors_headers);
            res.end();
        } catch (error) {
            res.writeHead(404, {});
            res.end(JSON.stringify({ message: error }));
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json"});
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});
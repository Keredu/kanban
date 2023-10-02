const http = require('http');
const kanbanAPI = require('./kanban.js');
const pomodoroAPI = require('./pomodoro_placeholder.js');

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
    if (req.method === "OPTIONS"){
        try{
            res.writeHead(200, cors_headers);
            res.end();
        } catch (error) {
            res.writeHead(404, {});
            res.end(JSON.stringify({ message: error }));
        }
    } else if (req.url.match("^/kanban")){
        req.url = req.url.replace(/^\/kanban/, '');
        const body = await kanbanAPI(req, res);
        return response(body);
    } else if (req.url.match("^/pomodoro")){
        req.url = req.url.replace(/^\/pomodoro/, '');
        const body = await pomodoroAPI(req, res);
        return response(body);
    } else {
        res.writeHead(404, { "Content-Type": "application/json"});
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

module.exports = server;
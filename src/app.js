const http = require('http');
const controller = require('./controller.js');
const kanbanAPI = require('./kanban.js');
const pomodoroAPI = require('./pomodoro_placeholder.js');

const PORT = process.env.PORT || 5000;


const server = http.createServer(async (req, res) => {
    // /kanban: Check if the request is for the kanban board
    if (req.url.match("^/kanban")){
        req.url = req.url.replace(/^\/kanban/, '');
        return kanbanAPI(req, res);
    } else if (req.url.match("^/pomodoro")){
        req.url = req.url.replace(/^\/pomodoro/, '');
        return pomodoroAPI(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json"});
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

function getReqData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

module.exports = server;
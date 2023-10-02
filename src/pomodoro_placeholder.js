const controller = require('./controller.js');

async function pomodoroAPI(req, res) {
    
    // /item : GET or /column : GET - returns all the items
    if (req.url.match("^/(?:column|item)/$") && req.method === "GET"){
        const mode = req.url.split("/")[1];
        const sql = await new controller().getItems(mode);
        return sql;
    // /item/:id : GET or /column/:id : GET - returns an item given its id
    } else {
        res.writeHead(404, { "Content-Type": "application/json"});
        res.end(JSON.stringify({ message: "Route not found" }));
    }
};

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

module.exports = pomodoroAPI;
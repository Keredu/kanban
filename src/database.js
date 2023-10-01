const postgres = require('postgres');
const fs = require('fs');

const obj = JSON.parse(fs.readFileSync('./conf/credentials.json', 'utf8'));
const sql = postgres(`postgres://${obj["username"]}:${obj["password"]}@${obj["host"]}:${obj["port"]}/${obj["database"]}`)

module.exports = sql;
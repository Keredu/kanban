import postgres from 'postgres';
import fs from 'fs';

const obj = JSON.parse(fs.readFileSync('./conf/credentials.json', 'utf8'));
const sql = postgres(`postgres://${obj["username"]}:${obj["password"]}@${obj["host"]}:${obj["port"]}/${obj["database"]}`)
export default sql
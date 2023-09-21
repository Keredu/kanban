import postgres from 'postgres'

const file = Bun.file('./public/js/api/conf/credentials.json');
const credentials = await file.json(file);
const sql = postgres(`postgres://${credentials["username"]}:${credentials["password"]}@${credentials["host"]}:${credentials["port"]}/${credentials["database"]}`) // will use psql environment variables

export default sql
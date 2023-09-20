import postgres from "postgres";

const item = {
    id: 1,
    name: 'Probar bun database',
    description: 'Prueba de bun database'
}

const item2 = {
    position: 1,
    columnId: 1,
    name: 'Probar BUN',
    description: 'Prueba de BUN'
}

const columns = ['name', 'description']

const file = Bun.file('./conf/credentials.json')
const credentials = await file.json(file);

const sql = postgres(`postgres://${credentials["username"]}:${credentials["password"]}@${credentials["host"]}:${credentials["port"]}/${credentials["database"]}`);

const read = await sql`SELECT * FROM item`;

console.log(read);
/* 
const write = await sql`UPDATE item set ${sql(item, columns)} where "itemId" = ${item.id}`;
const insert = await sql`INSERT INTO item ${sql(item2)}`
const deleto = await sql`DELETE FROM item WHERE "itemId" = 1`;
 */
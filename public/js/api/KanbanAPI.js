import sql from './database.js';

export default class KanbanAPI {

	static async getItems(mode) {
        const str = `SELECT * FROM item`;
        return await sql`SELECT * FROM ${sql(mode)}`;
	}

    static async insertItem(item, mode){
        return await sql`INSERT INTO ${sql(mode)}  ${sql(item)}`;
    }

    static async updateItem(itemId, newItem, mode){
        return await sql`UPDATE ${sql(mode)}  set ${sql(newItem, Object.keys(newItem))} where ${sql(mode + "Id")} = ${itemId}`;
    }

    static async deleteItem(itemId, mode){
        return await sql`DELETE FROM ${sql(mode)} WHERE ${sql(mode + "Id")} = ${itemId}`;
        //return await sql`DELETE FROM ${sql(mode)} WHERE "${sql(mode + "Id")}" = ${itemId}`;
    }


}

async function connection(){
    const file = Bun.file('./public/js/api/conf/credentials.json');
    const credentials =  await file.json(file);
    const engine = postgres(`postgres://${credentials["username"]}:${credentials["password"]}@${credentials["host"]}:${credentials["port"]}/${credentials["database"]}`);
    return engine;
}


function read(){
    const json = localStorage.getItem("kanban-data");

    if(!json){
        return [
            {
                id:1,
                items: []
            },
            {
                id:2,
                items: []
            },
            {
                id:3,
                items: []
            },
        ];
    }

    return JSON.parse(json);
}

function save(data){
    localStorage.setItem("kanban-data", JSON.stringify(data));
}
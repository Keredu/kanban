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
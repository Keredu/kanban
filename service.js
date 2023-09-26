import sql from './database.js';

class KanbanService{

    static getItems(mode){
        if(mode === "item"){
            return sql`Select * from ${sql(mode)} ORDER BY ${sql("position")} ASC`;
        }
        return sql`Select * from ${sql(mode)}`;
    }
    
    static getItemId(itemId, mode){
        return sql`Select * from ${sql(mode)} where ${sql(mode + "Id")} = ${itemId}`;
    }

    static getItemByColumnId(columnId, mode){
        return sql`Select * from ${sql(mode)} where ${sql("columnId")} = ${columnId} ORDER BY ${sql("position")} ASC`;
    }
    
    static createItem(item, mode){
        return sql`INSERT INTO ${sql(mode)} ${sql(item)}`;
    }

    static getLastItem(mode){
        return sql`SELECT * FROM ${sql(mode)} ORDER BY ${sql(mode + "Id")} DESC LIMIT 1`;
    }
    
    static updateItem(itemId, newItem, mode){
        
        if ('position' in newItem){
            const result = this.getItemId(itemId, mode);
            result.then((data) => {
                console.log(newItem);
                const oldItem = data[0];
                if(oldItem.columnId != newItem.columnId){
                    const origin = sql`UPDATE ${sql(mode)}  set ${sql("position")} = ${sql("position")} - 1 where ${sql("columnId")} = ${oldItem.columnId} and ${sql("position")} > ${oldItem.position}`;
                    const destiny = sql`UPDATE ${sql(mode)}  set ${sql("position")} = ${sql("position")} + 1 where ${sql("columnId")} = ${newItem.columnId} and ${sql("position")} >= ${newItem.position}`;
                    Promise.all([origin, destiny]).then(() => {
                        const resultSql = sql`UPDATE ${sql(mode)}  set ${sql(newItem, Object.keys(newItem))} where ${sql(mode + "Id")} = ${itemId}`;
                        return resultSql;
                    });
                } else if(oldItem.position != newItem.position) {
                    let move = null;
                    if(oldItem.position > newItem.position){
                        console.log("move up");
                        move = sql`UPDATE ${sql(mode)}  set ${sql("position")} = ${sql("position")} + 1 where ${sql("columnId")} = ${oldItem.columnId} and ${sql("position")} >= ${newItem.position} and ${sql("position")} < ${oldItem.position}`;
                    } else {
                        console.log("move down");
                        move = sql`UPDATE ${sql(mode)}  set ${sql("position")} = ${sql("position")} - 1 where ${sql("columnId")} = ${oldItem.columnId} and ${sql("position")} > ${oldItem.position} and ${sql("position")} <= ${newItem.position}`;
                    }
                    move.then(() => {
                        const resultSql = sql`UPDATE ${sql(mode)}  set ${sql(newItem, Object.keys(newItem))} where ${sql(mode + "Id")} = ${itemId}`;
                        return resultSql;
                    });
                };
            });
            return result;
        } else {
            const resultSql = sql`UPDATE ${sql(mode)}  set ${sql(newItem, Object.keys(newItem))} where ${sql(mode + "Id")} = ${itemId}`;
            return resultSql;
        }
    }
    
    static deleteItem(itemId, mode){
        const result = this.getItemId(itemId, mode);
            result.then((data) => {
                const oldItem = data[0];
                const moveup = sql`UPDATE ${sql(mode)} set ${sql("position")} = ${sql("position")} - 1 where ${sql("columnId")} = ${oldItem.columnId} and ${sql("position")} > ${oldItem.position}`;
                moveup.then(() => {
                    const resultSql = sql`DELETE FROM ${sql(mode)} WHERE ${sql(mode + "Id")} = ${itemId}`;
                    return resultSql;
                });
            });
    }
}

export default KanbanService;
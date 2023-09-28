import sql from './database.js';
/**
 * KanbanService class
 * 
 * @class KanbanService
 * 
 * @method getItems
 * @method getItemId
 * @method getItemByColumnId
 * @method createItem
 * @method getLastItem
 * @method updateItem
 * @method deleteItem
 * 
 */
class KanbanService{

    /**
     * This method returns all the items
     * 
     * @function
     * 
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    static getItems(mode){
        if(mode === "item"){
            return sql`Select * from ${sql(mode)} ORDER BY ${sql("position")} ASC`;
        }
        return sql`Select * from ${sql(mode)}`;
    }
    
    /**
     * This method returns an item given its id
     * 
     * @function
     * 
     * @param {Int} itemId - the id of the item
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    static getItemId(itemId, mode){
        return sql`Select * from ${sql(mode)} where ${sql(mode + "Id")} = ${itemId}`;
    }

    /**
     * This method returns an item given its column id
     * 
     * @function
     * 
     * @param {Int} columnId - the id of the column
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    static getItemByColumnId(columnId, mode){
        return sql`Select * from ${sql(mode)} where ${sql("columnId")} = ${columnId} ORDER BY ${sql("position")} ASC`;
    }
    
    /**
     * This method creates an item
     * 
     * @function
     * 
     * @param {Item} item - the item to be created 
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    static createItem(item, mode){
        return sql`INSERT INTO ${sql(mode)} ${sql(item)}`;
    }

    /**
     * This method returns the last item created
     * 
     * @function
     * 
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    static getLastItem(mode){
        return sql`SELECT * FROM ${sql(mode)} ORDER BY ${sql(mode + "Id")} DESC LIMIT 1`;
    }
    
    /**
     * This method updates an item. If the item is moved to another column, 
     * it updates the position of the items in the origin and destiny columns.
     * If the item is moved to the same column, it updates the position of the items.
     * 
     * @param {Int} itemId - the id of the item
     * @param {Item} newItem - the new item
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
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
    
    /**
     * This method deletes an item. It updates the position of the items in the same column.
     * 
     * @param {Int} itemId - the id of the item
     * @param {String} mode - it can be "item" or "column"
     */
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
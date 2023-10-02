const sql = require('./database.js');
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
     * This method updates an item
     * 
     * @function
     * 
     * @param {Int} itemId - the id of the item
     * @param {Item} newItem - the updated item
     * @param {String} mode - it can be "item" or "column"
     * @returns 
     */
    static async updateItem(itemId, newItem, mode) {
        if (!('position' in newItem)) {
            return sql`UPDATE ${sql(mode)} set ${sql(newItem, Object.keys(newItem))} where ${sql(mode + "Id")} = ${itemId}`;
        }
        
        const oldItem = (await this.getItemId(itemId, mode))[0];
        if (oldItem.columnId !== newItem.columnId) {
            await this.updatePositionAcrossColumns(oldItem, newItem, mode);
        } else if (oldItem.position !== newItem.position) {
            await this.updatePositionWithinSameColumn(oldItem, newItem, mode);
        }
        
        return sql`UPDATE ${sql(mode)} set ${sql(newItem, Object.keys(newItem))} where ${sql(mode + "Id")} = ${itemId}`;
    }
    
    /**
     * This method updates the position of the items when an item is moved across columns.
     * 
     * @function
     * 
     * @param {Int} itemId - the id of the item
     * @param {Item} newItem - the updated item
     * @param {String} mode - it can be "item" or "column"
     */
    static async updatePositionAcrossColumns(oldItem, newItem, mode) {
        const origin = sql`UPDATE ${sql(mode)} set ${sql("position")} = ${sql("position")} - 1 where ${sql("columnId")} = ${oldItem.columnId} and ${sql("position")} > ${oldItem.position}`;
        const destiny = sql`UPDATE ${sql(mode)} set ${sql("position")} = ${sql("position")} + 1 where ${sql("columnId")} = ${newItem.columnId} and ${sql("position")} >= ${newItem.position}`;
        await Promise.all([origin, destiny]);
    }
    
    /**
     * This method updates the position of the items when an item is moved within the same column.
     * 
     * @function
     * 
     * @param {Int} itemId - the id of the item
     * @param {Item} newItem - the updated item
     * @param {String} mode - it can be "item" or "column"
     */
    static async updatePositionWithinSameColumn(oldItem, newItem, mode) {
        const positionShift = oldItem.position > newItem.position
            ? sql`UPDATE ${sql(mode)} set ${sql("position")} = ${sql("position")} + 1 where ${sql("columnId")} = ${oldItem.columnId} and ${sql("position")} >= ${newItem.position} and ${sql("position")} < ${oldItem.position}`
            : sql`UPDATE ${sql(mode)} set ${sql("position")} = ${sql("position")} - 1 where ${sql("columnId")} = ${oldItem.columnId} and ${sql("position")} > ${oldItem.position} and ${sql("position")} <= ${newItem.position}`;
    
        await positionShift;
    }

    /**
     * This method deletes an item. It updates the position of the items in the same column.
     * 
     * @param {Int} itemId - the id of the item
     * @param {String} mode - it can be "item" or "column"
     */
    static async deleteItem(itemId, mode) {
        const data = await this.getItemId(itemId, mode);
        const oldItem = data[0];
    
        await sql`UPDATE ${sql(mode)} SET ${sql("position")} = ${sql("position")} - 1 WHERE ${sql("columnId")} = ${oldItem.columnId} AND ${sql("position")} > ${oldItem.position}`;
        
        const resultSql = sql`DELETE FROM ${sql(mode)} WHERE ${sql(mode + "Id")} = ${itemId}`;
        return resultSql;
    }

}

module.exports = KanbanService;
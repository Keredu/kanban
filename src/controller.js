const KanbanService = require('./service.js');

/**
 * Controller class
 * 
 * @class Controller
 * 
 * @method getItems
 * @method getItem
 * @method getItemByColumnId
 * @method createItem
 * @method getLastItem
 * @method updateItem
 * @method deleteItem
 */

class Controller {
    

    /**
     * This method returns all the items
     * 
     * @function
     * 
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    async getItems(mode) {
        const result = KanbanService.getItems(mode);
        return result.then((data) => data);
    }

    /**
     * This method returns an item given its id
     * 
     * @function
     * 
     * @param {Int} id - the id of the item
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    async getItem(id, mode) {
        const result = KanbanService.getItemId(id, mode);
        return result.then((data) => data);
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
    async getItemByColumnId(columnId, mode) {
        const result = KanbanService.getItemByColumnId(columnId, mode);
        return result.then((data) => data);
    }

    /**
     * This method creates an item
     * 
     * @function
     * 
     * @param {Item} item - the item to create
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    async createItem(item, mode) {
        const result = KanbanService.createItem(item, mode);
        return result.then((data) => data);
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
    async getLastItem(mode) {
        const result = KanbanService.getLastItem(mode);
        return result.then((data) => data);
    }

    /**
     * This method updates an item
     * 
     * @function
     * 
     * @param {Int} itemId 
     * @param {Item} newItem 
     * @param {String} mode 
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    async updateItem(itemId, newItem, mode) {
        const result = KanbanService.updateItem(itemId, newItem, mode);
        return result.then((data) => data);
    }

    /**
     * This method deletes an item
     * 
     * @function
     * 
     * @param {Int} id - the id of the item to delete
     * @param {String} mode - it can be "item" or "column"
     * 
     * @returns {Promise} - returns a promise with the result of the request
     */
    async deleteItem(id, mode) {
        const result = KanbanService.deleteItem(id, mode);
        return result.then((data) => data);
    }
}

module.exports = Controller;
import KanbanService from "./service.js";

export default class Controller {
    // getting all todos
    async getItems(mode) {
        const result = KanbanService.getItems(mode);
        return result.then((data) => data);
    }

    async getItem(id, mode) {
        const result = KanbanService.getItemId(id, mode);
        return result.then((data) => data);
    }

    async getItemByColumnId(columnId, mode) {
        const result = KanbanService.getItemByColumnId(columnId, mode);
        return result.then((data) => data);
    }

    async createItem(item, mode) {
        const result = KanbanService.createItem(item, mode);
        return result.then((data) => data);
    }

    async getLastItem(mode) {
        const result = KanbanService.getLastItem(mode);
        return result.then((data) => data);
    }

    async updateItem(itemId, newItem, mode) {
        const result = KanbanService.updateItem(itemId, newItem, mode);
        return result.then((data) => data);
    }

    async deleteItem(id, mode) {
        const result = KanbanService.deleteItem(id, mode);
        return result.then((data) => data);
    }
}
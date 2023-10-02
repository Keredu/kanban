const request = require('supertest');
const Controller = require('../src/controller.js');
const server = require('../src/app.js');

jest.mock('../src/controller.js');

afterEach(() => {
    jest.clearAllMocks();
  });

describe('GET: Unit test for get all', () => {

    jest.spyOn(Controller.prototype, 'getItems').mockImplementation((mode) => {
        if (mode === "item"){
            return [{id: 1, name: "item1", position: 1, column_id: 1},{id: 2, name: "item2", position: 2, column_id: 1}];
        } else {
            return [{id: 1, name: "column1"},{id: 2, name: "column2"}];
        }
        })

it('should return all items', async () => {
    const response = await request(server).get('/kanban/item/');
    expect(response.body).toEqual([{id: 1, name: "item1", position: 1, column_id: 1},{id: 2, name: "item2", position: 2, column_id: 1}]);
});

it('should return all columns', async () => {
    const response = await request(server).get('/kanban/column/');
    expect(response.body).toEqual([{id: 1, name: "column1"},{id: 2, name: "column2"}]);
});

});

describe('GET: Unit test for get an object by id', () => {
    jest.spyOn(Controller.prototype, 'getItem').mockImplementation((id, mode) => {
        if (mode === "item"){
            return [{id: 2, name: "item1", position: 1, column_id: 1}];
        } else {
            return [{id: 1, name: "column1"}];
        }
    })


it('should return an item given its id', async () => {
    const response = await request(server).get('/kanban/item/1');
    expect(response.body).toEqual([{id: 2, name: "item1", position: 1, column_id: 1}]);
});

it('should return a column given its id', async () => {
    const response = await request(server).get('/kanban/column/1');
    expect(response.body).toEqual([{id: 1, name: "column1"}]);
});

});

describe('Unit test for GET an object by column id', () => {

    jest.spyOn(Controller.prototype, 'getItemByColumnId').mockImplementation((id, mode) => {
        if (mode == "item"){
            return [{id: 1, name: "item1 - Columna1", position: 1, column_id: 1},{id: 2, name: "item2 - Columna1", position: 2, column_id: 1}];
        } else {
            return [];
        }
    })

    it('should return all item given its column id', async () => {
        const response = await request(server).get('/kanban/item/1/column/');
        expect(response.body).toEqual([{id: 1, name: "item1 - Columna1", position: 1, column_id: 1},{id: 2, name: "item2 - Columna1", position: 2, column_id: 1}]);
    });
});

describe('POST: Unit test for create an object', () => {
    jest.spyOn(Controller.prototype, 'createItem').mockImplementation((object, mode) => {
        object.id = 3;
        if (mode == "item"){
            return [object];
        } else {
            return [object];
        }
    })

    it('should create an item', async () => {
        //Mock the createItem method
    
        const response = await request(server).post('/kanban/item/').send({name: "item3", position: 3, column_id: 1});
        expect(response.body).toEqual([{id: 3, name: "item3", position: 3, column_id: 1}]);
    });

    it('should create a column', async () => {
        //Mock the createItem method
        const response = await request(server).post('/kanban/column/').send({name: "column3"});
        expect(response.body).toEqual([{id: 3, name: "column3"}]);
    });

});

describe('PUT: Unit test for update an object', () => {
    jest.spyOn(Controller.prototype, 'updateItem').mockImplementation((id, object, mode) => {
        if (mode == "item"){
            let items = [{id: 1, name: "item1", position: 1, column_id: 1},{id: 2, name: "item2", position: 2, column_id: 1}];
            const item = items.find(item => item.id == id);
            const index = items.indexOf(item);
            items[index] = object;
            return items;
        } else {
            let columns = [{id: 1, name: "column1"},{id: 2, name: "column2"}];
            const column = columns.find(column => column.id == id);
            const index = columns.indexOf(column);
            columns[index] = object;
            return columns;
        }
    });

    it('should update an item', async () => {
        const response = await request(server).put('/kanban/item/2').send({id: 2, name: "item Actualizado", position: 2, column_id: 1});
        expect(response.body).toEqual([{id: 1, name: "item1", position: 1, column_id: 1},{id: 2, name: "item Actualizado", position: 2, column_id: 1}]);
    });

    it('should update a column', async () => {
        const response = await request(server).put('/kanban/column/2').send({id: 2, name: "column Actualizado"});
        expect(response.body).toEqual([{id: 1, name: "column1"},{id: 2, name: "column Actualizado"}]);
    });

});

describe('DELETE: Unit test for delete an object', () => {
    jest.spyOn(Controller.prototype, 'deleteItem').mockImplementation((id, mode) => {
        if (mode == "item"){
            return 'Item deleted';
        } else {
            return 'Column deleted';
        }
    });
    
    it('should delete an item', async () => {
        const response = await request(server).delete('/kanban/item/3');
        expect(response.body).toEqual('Item deleted');
    });

    it('should delete a column', async () => {
        const response = await request(server).delete('/kanban/column/3');
        expect(response.body).toEqual('Column deleted');
    });
    
});

afterAll(done => {
    server.close();
    done();
});
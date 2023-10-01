const request = require('supertest');
const Controller = require('../src/controller.js');
const server = require('../src/app.js');

jest.mock('../src/controller.js');

//Mock the getItems method
jest.spyOn(Controller.prototype, 'getItems').mockImplementation((mode) => {
    if (mode === "item"){
        return [{id: 1, name: "item1", position: 1, column_id: 1},{id: 2, name: "item2", position: 2, column_id: 1}];
    } else {
        return [{id: 1, name: "column1"},{id: 2, name: "column2"}];
    }
})

//Mock the getItem method
jest.spyOn(Controller.prototype, 'getItem').mockImplementation((id, mode) => {
    if (mode === "item"){
        return [{id: 2, name: "item1", position: 1, column_id: 1}];
    } else {
        return [{id: 1, name: "column1"}];
    }
})

//Mock the getItemByColumnId method
jest.spyOn(Controller.prototype, 'getItemByColumnId').mockImplementation((id, mode) => {
    if (mode == "item"){
        return [{id: 1, name: "item1 - Columna1", position: 1, column_id: 1},{id: 2, name: "item2 - Columna1", position: 2, column_id: 1}];
    } else {
        return [];
    }
})

//Mock the createItem method
jest.spyOn(Controller.prototype, 'createItem').mockImplementation((object, mode) => {
    object.id = 3;
    if (mode == "item"){
        return [object];
    } else {
        return [object];
    }
})

//Mock the updateItem method
jest.spyOn(Controller.prototype, 'updateItem').mockImplementation((id, object, mode) => {
    if (mode == "item"){
        let items = [{id: 1, name: "item1", position: 1, column_id: 1},{id: 2, name: "item2", position: 2, column_id: 1}];
        const item = items.find(item => item.id == id);
        console.log(item);
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

//Mock the deleteItem method
jest.spyOn(Controller.prototype, 'deleteItem').mockImplementation((id, mode) => {
    if (mode == "item"){
        return 'Item deleted';
    } else {
        return 'Column deleted';
    }
});


it('should return all items', async () => {
    const response = await request(server).get('/item/');
    expect(response.body).toEqual([{id: 1, name: "item1", position: 1, column_id: 1},{id: 2, name: "item2", position: 2, column_id: 1}]);
});

it('should return an item given its id', async () => {
    const response = await request(server).get('/item/1');
    expect(response.body).toEqual([{id: 2, name: "item1", position: 1, column_id: 1}]);
});

it('should return all item given its column id', async () => {
    const response = await request(server).get('/item/1/column/');
    expect(response.body).toEqual([{id: 1, name: "item1 - Columna1", position: 1, column_id: 1},{id: 2, name: "item2 - Columna1", position: 2, column_id: 1}]);
});

it('should return all columns', async () => {
    const response = await request(server).get('/column/');
    expect(response.body).toEqual([{id: 1, name: "column1"},{id: 2, name: "column2"}]);
});

it('should return a column given its id', async () => {
    const response = await request(server).get('/column/1');
    expect(response.body).toEqual([{id: 1, name: "column1"}]);
});

it('should create an item', async () => {
    const response = await request(server).post('/item/').send({name: "item3", position: 3, column_id: 1});
    expect(response.body).toEqual([{id: 3, name: "item3", position: 3, column_id: 1}]);
});

it('should create a column', async () => {
    const response = await request(server).post('/column/').send({name: "column3"});
    expect(response.body).toEqual([{id: 3, name: "column3"}]);
});

it('should update an item', async () => {
    const response = await request(server).put('/item/2').send({id: 2, name: "item Actualizado", position: 2, column_id: 1});
    expect(response.body).toEqual([{id: 1, name: "item1", position: 1, column_id: 1},{id: 2, name: "item Actualizado", position: 2, column_id: 1}]);
});

it('should update a column', async () => {
    const response = await request(server).put('/column/2').send({id: 2, name: "column Actualizado"});
    expect(response.body).toEqual([{id: 1, name: "column1"},{id: 2, name: "column Actualizado"}]);
});

it('should delete an item', async () => {
    const response = await request(server).delete('/item/3');
    expect(response.body).toEqual('Item deleted');
});

it('should delete a column', async () => {
    const response = await request(server).delete('/column/3');
    expect(response.body).toEqual('Column deleted');
});



afterAll(done => {
    server.close();
    done();
});
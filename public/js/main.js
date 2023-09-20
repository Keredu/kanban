import KanbanAPI from "./api/KanbanAPI.js";

/*
CTRL + SHIFT + C -> Console: Te muestra datos según la variable kanban-data
*/

const item = {
    position: 1,
    columnId: 2,
    name: 'Probar base de datos',
    description: 'Prueba de base de datos'
};

const item_update = {
    position: 1,
    columnId: 2,
    name: 'DBDLODASDA',
    description: 'DBDLODASDASD'
};

const colum = {
    name: 'Paquito',
    description: 'Liarla'
}

const colum_update = {
    name: 'PaquitoTWO',
    description: 'LiarlaTWO'
}



KanbanAPI.getItems('column').then( (value) => { console.log(value);});
KanbanAPI.insertItem(colum, 'column').then( (value) => { console.log(value);});
KanbanAPI.updateItem(2, colum_update, 'column').then( (value) => { console.log(value);});
KanbanAPI.deleteItem(3, 'column').then( (value) => { console.log(value);});
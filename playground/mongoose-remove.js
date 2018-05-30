const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// remove all records

// Todo.remove({}).then((result) => {
//     console.log(result);
// });


// remove by property

// Todo.findOneAndRemove({
//     text: 'Eat breakfast'
// }).then((doc) => {
//     console.log(doc);
// });


// remove by id

// Todo.findByIdAndRemove("5b0e48be1106611145e03526").then((doc) => {
//     console.log(doc);
// })
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


const id = '5b0d870811177638346d080d111';

// Todo.find({_id: id}).then((todos) => {
//     console.log('Todos', todos);
// });
//
// Todo.findOne({_id : id}).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     console.log('Todo by id', todo);
// }).catch((err) => {
//     if (!ObjectID.isValid(id)) {
//         console.log('Id is not valid.');
//     } else {
//         console.log(err);
//     }
// });

const userId = '5b0cfb5e0b2fa90a3c24dd68';

User.findById(userId).then((user) => {
    if (!user) {
        return console.log('No user was found for given id.');
    }
    console.log(JSON.stringify(user, undefined, 2));
}, (err) => {
    if (!ObjectID.isValid(userId)) {
        return console.log('Error: id is invalid.');
    }
    console.log(err);
});


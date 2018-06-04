const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'ioana@gmail.com',
    password: '123user1',
    tokens: [{
        access: 'auth',
        token:  jwt.sign({_id: userOneId, auth: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'someone@gmail.com',
    password: '123user2',
    tokens: [{
        access: 'auth',
        token:  jwt.sign({_id: userTwoId, auth: 'auth'}, 'abc123').toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    _creator: userOneId,
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    _creator: userOneId,
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}, {
    _id: new ObjectID(),
    _creator: userTwoId,
    text: 'Third test todo'
}];

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => { return Todo.insertMany(todos);})
        .then(() => done());
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            let userOne = new User(users[0]).save();
            let userTwo = new User(users[1]).save();
            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
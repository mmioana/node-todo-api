const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    }

    console.log('Connected to MongoDB server');

const db = client.db('TodoApp');

// db.collection('Todos')
//     .find({
//         _id: new ObjectID("5b0c3a5e1106611145e012b7")
//     })
//     .toArray()
//     .then((docs) => {
//     console.log(JSON.stringify(docs, undefined, 2));
// }, (err) => {
//     console.log('Unable to get docs.', err);
// });

// db.collection('Todos')
//     .find()
//     .count()
//     .then((count) => {
//     console.log(`Todos'count: ${count}`);
// }, (err) => {
//     console.log('Unable to get docs.', err);
// });

db.collection('Users').find({
        name: 'Ionut'
    })
    .toArray()
    .then((user) => {
        console.log(JSON.stringify(user, undefined, 2));
    })
    .catch((err) => {
        console.log('Unable to fetch user.', err);
    });

client.close();
});
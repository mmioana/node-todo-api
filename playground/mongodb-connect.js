const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    }

    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Should create some course',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert into Todos');
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Ioana',
    //     age: 24,
    //     location: 'TM'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert user');
    //     }
    //
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });


    client.close();
});
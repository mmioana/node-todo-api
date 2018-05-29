const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB');
    }

    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Verify mailbox'})
    //     .then((res) => {
    //     console.log(res);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Lunch'})
    //     .then((res) => {
    //     console.log(res);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false})
    //     .then((res) => {
    //         console.log(res);
    // });


    // deleteMany - users
    db.collection('Users')
        .deleteMany({ name: 'Ioana'})
        .then((res) => {
        console.log(res);
    });

    // findOneAndDelete

    db.collection('Users')
        .findOneAndDelete({
            _id: new ObjectID('5b0c373048541f4264cc9439')
        })
        .then((res) => {
        console.log(res);
    });

     client.close();
});
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let app = express();
let port = process.env.PORT || 8000;

app.use(bodyParser.json());


app.post('/todos', (req, res) => {
    let todo = new Todo(req.body);
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});


app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    let todoId = req.params.id;
    Todo.findById(todoId)
        .then((doc) => {
            if (!doc) {
                res.status(404).send('');
            }
            res.send(doc);
        })
        .catch((e) => {
            if (!ObjectID.isValid(todoId)) {
                res.status(400).send('Invalid id.');
            }
            res.send(e);
        });
})

app.delete('/todos/:id', (req, res) => {
    let todoId = req.params.id;

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send('Invalid id.');
    }

    Todo.findByIdAndRemove(todoId)
        .then((doc) => {
            if (!doc) {
                return res.status(404).send('Todo not found.');
            }
            res.send(doc);
        })
        .catch((err) => {
            res.status(404).send(err);
        });
});



app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});

module.exports = {app};
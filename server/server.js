const express = require('express');
const bodyParser = require('body-parser');

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

// GET /todos/:id

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
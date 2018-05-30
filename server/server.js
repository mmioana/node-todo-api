const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const config = require('./config/config');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

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
        .then((todo) => {
            if (!todo) {
                res.status(404).send('');
            }
            res.send({todo});
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
        .then((todo) => {
            if (!todo) {
                return res.status(404).send('Todo not found.');
            }
            res.send({todo});
        })
        .catch((err) => {
            res.status(404).send(err);
        });
});

app.patch('/todos/:id', (req, res) => {
    let todoId = req.params.id;

    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send('Invalid id.');
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(todoId, {
            $set: body
        }, {
            new: true
        })
        .then((todo) => {
            if (!todo) {
                res.status(404).send();
            }
            res.send({todo});
        })
        .catch((err) => {
            res.status(400).send(res);
        });

});


app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save()
        .then(() => user.generateAuthToken())
        .then((token) => {
            res.header('x-auth', token).send(user.toJson());
        }).catch((err) => {
            res.status(400).send(err);
        });
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user.toJson());
});


app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});

module.exports = {app};
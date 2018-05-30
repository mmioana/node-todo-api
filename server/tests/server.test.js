const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
});

describe('Server', () => {
    describe('POST /todos', () => {
        it('should create a new todo', (done) => {
           const text = 'Create new test suite';

           request(app)
               .post('/todos')
               .send({text})
               .expect(200)
               .expect((res) => {
                    expect(res.body.text).toBe(text);
                })
               .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.find({text}).then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                });
        });

        it('should not create todo with invalid data', (done) => {
            request(app)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.find().then((todos) => {
                        expect(todos.length).toBe(todos.length);
                        done();
                    }, (err) => {
                        done(err);
                    });
                });
        });
    });

    describe('GET /todos', () => {
        it('should get all todos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                expect(res.body.todos.length).toBe(todos.length);
        })
        .end(done);
        });
    });

    describe('GET /todos/:id', () => {
        it('should get valid todo', (done) => {

            let todoId = todos[0]._id.toHexString();

            request(app)
                .get(`/todos/${todoId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });

        it('should return 404 if todo not found', (done) => {
            var id = new ObjectID().toHexString();
            request(app)
                .get(`/todos/${id}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', (done) => {
            var id = new ObjectID().toHexString() + 'abc';
                request(app)
                    .get(`/todos/${id}`)
                    .expect(400)
                    .expect((res) => {
                        expect(res.text).toBe('Invalid id.');
                    })
                    .end(done);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should delete valid todo', (done) => {

            let todoId = todos[0]._id.toHexString();

            request(app)
                .delete(`/todos/${todoId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.findById(todoId)
                        .then((todo) => {
                            expect(todo).toBeFalsy();
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('should return 404 if todo not found', (done) => {
            let todoId = new ObjectID().toHexString();

            request(app).delete(`/todos/${todoId}`).expect(404).end(done);

        });

        it('should return 404 for non-object ids', (done) => {
            let todoId = new ObjectID().toHexString() + '123';

            request(app).delete(`/todos/${todoId}`).expect(404).end(done);
        });
    });
});
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

    describe('PATCH /todos/:id', () => {
        it('should complete todo', (done) => {
            const todoId = todos[2]._id.toHexString();
            const body = { text: 'Updated text value'};

            request(app)
                .patch(`/todos/${todoId}`)
                .send(body)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.findById(todoId)
                        .then((todo) => {
                            expect(todo.text).toBe(body.text);
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('should clear completedAt', (done) => {
            const todoId = todos[1]._id.toHexString();
            const body = {text: todos[1].text, completed: false};

            request(app)
                .patch(`/todos/${todoId}`)
                .send(body)
                .expect(200)
                .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(todoId)
                    .then((todo) => {
                        expect(todo.completedAt).toBeFalsy();
                        done();
                    })
                    .catch((err) => done(err));
            });
        })
    });

    describe('GET /users/me', () => {
        it('should return user if authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.email).toBe(users[0].email);
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                })
                .end(done);
        });
        it('should return 401 if not authenticated', (done) => {
            request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                })
                .end(done);
        });
    });

    describe('POST /users', () => {
        it('should create user', (done) => {
            let email = 'test@test.com';
            let password = 'somevalue12';

            request(app)
                .post('/users')
                .send({email, password})
                .expect(200)
                .expect((res) => {
                    console.log(res.body);
                    expect(res.header['x-auth']).toBeTruthy();
                    expect(res.body._id).toBeTruthy();
                    expect(res.body.email).toBe(email);
                })
                .end((err, res) => {

                    if (err) {
                        return done(err);
                    }

                    User.find().then((users) => {
                        expect(users.length).toBe(3);
                        done();
                    }).catch(err => done(err));
                });
        });

        it('should return validation errors if request is invalid', (done) => {
            let email = 'testest.com';
            let password = 'ae12';

            request(app)
                .post('/users')
                .send({email, password})
                .expect(400)
                .end(done);
        });

        it('should not create user if email in use', (done) => {
            let user = _.pick(users[0], ['email', 'password']);
            request(app)
                .post('/users')
                .send(user)
                .expect(400)
                .end(done);

        });
    });

    describe('POST /users/login', () => {
        it('should login user and return token', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password
                })
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toBeTruthy();
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    User.findById(users[1]._id).then((user) => {
                            expect(user.tokens[0]).toMatchObject({
                                access: 'auth',
                                token: res.headers['x-auth']
                            });
                            done();
                        }).catch( err => done(err));
                });
        });

        it('should return 400 for non-existent email', (done) => {
            request(app)
            .post('/users/login')
            .send({
                email: 'test@test.com',
                password: '123456'
            })
            .expect(400)
            .end(done);
        });

        it('should return 400 for wrong password', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[0].email,
                    password: users[0].password + '123'
                })
                .expect(400)
                .end(done);
        });
    });
});
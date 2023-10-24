/* global it describe */

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../app.js');
chai.should();
chai.use(chaiHttp);
chai.use(require('chai-json'));
const expect = chai.expect;
const ObjectId = require('mongodb').ObjectId;
const database = require("../db/database.js");
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const payload = {
    email: "test@test.se"
};
const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
const bcrypt = require('bcryptjs');
const password = "test";
const hash = bcrypt.hashSync(password, 10);
const sinon = require('sinon');
const { checkGQToken } = require('../models/auth.js');

describe('admin-related', () => {
    before(async () => {
        const db = await database.getDb();
        await db.collection.tickets.drop()
        await db.collection.users.drop()
        db.collection.users.createIndex( { "email": 1 }, { unique: true } )
        const docs = [
            { 
                _id: new ObjectId("000000013b7eef17104f27e5"),
                code: "ANA002",
                trainnumber: "9123",
                traindate: "2023-09-18"
            },
            {
                _id: new ObjectId("000000023b7eef17104f27e6"),
                code: "ANA003",
                trainnumber: "91234",
                traindate: "2023-09-18"
            },
        ];
        await db.collection.tickets.insertMany(docs);
        const user = { 
            _id: new ObjectId("000000013b7eef17104f27e5"),
            email: "test@test.com",
            hash: hash,
        };
        await db.collection.users.insertOne(user);
        // const allUsers = await db.collection.users.find({}).toArray();

        await db.client.close();
    });
    it('should return json with old tickets', async () => {
        const query = `{
            tickets {
                code
                trainnumber
            }
        }`;

        const response = await chai.request(server)
            .post("/graphql")
            .set("x-access-token", jwtToken)
            .set('Content-Type', 'application/json')
            .send({ query });

        const pattern = new RegExp('.*\\"code":"ANA003","trainnumber":"91234"},{"code":"ANA002","trainnumber":"9123"');

        const check = pattern.test(response.res.text);

        expect(check).to.equal(true);
    });
    it('request missing token when getting tickets', async () => {
        const query = `{
            tickets {
                code
                trainnumber
            }
        }`;

        const response = await chai.request(server)
            .post("/graphql")
            .set('Content-Type', 'application/json')
            .send({ query });

        const pattern = new RegExp('.*"errors":\\[{"message":"Token not provided"');

        const check = pattern.test(response.res.text)

        expect(check).to.equal(true)
    });
    it('should not access createTicket query without token', async () => {
        const query = `
        mutation {
            createTicket(code: "test_code", trainnumber: "123456", traindate: "2023-10-11") {
                code
            }
        }
        `;
        const response = await chai.request(server)
            .post("/graphql")
            .set('Content-Type', 'application/json')
            .send({ query });

        const pattern = new RegExp('.*"errors":\\[{"message":"Token not provided"');

        const check = pattern.test(response.res.text);

        expect(check).to.equal(true);
    });
    it('should not update ticket without token', async () => {
        const query = `
        mutation {
            updateTicket(_id: "000000013b7eef17104f27e5", code: "update_code") {
                code
                trainnumber
                traindate
            }
        }
        `;
        const response = await chai.request(server)
            .post("/graphql")
            .set('Content-Type', 'application/json')
            .send({ query });

        const pattern = new RegExp('.*"errors":\\[{"message":"Token not provided"');

        const check = pattern.test(response.res.text);

        expect(check).to.equal(true);

        const db = await database.getDb();
        const filter = {
            _id: new ObjectId("000000013b7eef17104f27e5")
        }
        const notUpdated = await db.collection.tickets.findOne(filter);
        chai.assert.equal(notUpdated.code, "ANA002");
        await db.client.close();
    });
    it('Update a ticket', async () => {
        const ticketData = {
            _id: new ObjectId("000000013b7eef17104f27e5"),
            code: 'update_code'
        };
        const mutation = `
            mutation {
                updateTicket (_id: "${ticketData._id}", code: "${ticketData.code}")
                {
                    code
                    trainnumber
                }
            }
        `;
        const response = await chai.request(server)
            .post("/graphql")
            .set("x-access-token", jwtToken)
            .set('Content-Type', 'application/json')
            .send({ query: mutation });

        expect(response).to.have.status(200);
        const pattern = new RegExp('.*:\\{"code":"update_code","trainnumber":"9123"}}}');

        const check = pattern.test(response.res.text);

        expect(check).to.equal(true);

        const db = await database.getDb();
        const filter = {
            _id: new ObjectId("000000013b7eef17104f27e5")
        };
        const updated = await db.collection.tickets.findOne(filter);
        chai.assert.equal(updated.code, "update_code");
        await db.client.close();
    });
    it('should not access deleteTicket query without valid token', async () => {
        const ticketData = `
        mutation {
            deleteTicket(_id: "000000023b7eef17104f27e6") {
                _id
            }
        }
        `;
        
        const response = await chai.request(server)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set("x-access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5zZSIsIm5hbWUiOiJUZXN0IFRlc3Rzc29uIiwiaWF0IjoxNjk3NjY2ODQ3LCJleHAiOjE2OTc3NTMyNDd9.nXfqPJXLSFUxna-l8hxgRbUNctfZ1XD70L6NWbA6EZQ")
            .send({query : ticketData});

        const pattern = new RegExp('.*:\\[{"message":"Failed authentication: jwt expired"')

        const check = pattern.test(response.res.text)

        expect(check).to.equal(true);
        expect(response.req.path).to.equal("/graphql");
        const db = await database.getDb();
        const notDeleted = await db.collection.tickets.findOne({_id: new ObjectId("000000023b7eef17104f27e6")});
        chai.assert.equal(notDeleted.trainnumber, 91234);
        await db.client.close();

    });
    it('Delete a ticket', async () => {
        const ticketData = {
            _id: new ObjectId("000000023b7eef17104f27e6"),
        };

        const mutation = `
            mutation {
                deleteTicket (_id: "${ticketData._id}")
                {
                    _id
                }
            }
        `;

        const response = await chai.request(server)
            .post("/graphql")
            .set("x-access-token", jwtToken)
            .set('Content-Type', 'application/json')
            .send({ query: mutation })

        expect(response).to.have.status(200);
        const pattern = new RegExp('.*:\\{"_id":"000000023b7eef17104f27e6"}}}')

        const check = pattern.test(response.res.text)

        expect(check).to.equal(true);

        const db = await database.getDb();
        const deleted = await db.collection.tickets.findOne(ticketData);
        chai.assert.isNull(deleted);
        await db.client.close();

    });
    it('should create a new ticket request', async () => {
        const ticketData = {
            code: 'test_code',
            trainnumber: '123456',
            traindate: '2023-09-16'
        };

        const mutation = `
            mutation {
                createTicket (code: "${ticketData.code}", trainnumber: "${ticketData.trainnumber}", traindate: "${ticketData.traindate}")
                {
                    _id
                    code
                    trainnumber
                    traindate
                }
            }
        `;

        const response = await chai.request(server)
            .post("/graphql")
            .set("x-access-token", jwtToken)
            .set('Content-Type', 'application/json')
            .send({ query: mutation })

        const ticketReturnData = await JSON.parse(response.res.text).data.createTicket

        const id = ticketReturnData._id;

        expect(response).to.have.status(200);
        const pattern = new RegExp('.*"code":"test_code","trainnumber":"123456".*');

        const check = pattern.test(response.res.text)

        expect(check).to.equal(true);

        const db = await database.getDb();
        const latest = await db.collection.tickets.findOne({
            _id: new ObjectId(id)
        });

        await db.client.close();
        chai.assert.equal(latest.code, 'test_code');
    });
    it('login', async () => {
        const userData = {
            email: "test@test.com",
            password: password,
        };
        const response = await chai.request(server).post('/login').send(userData);
        expect(response).to.have.status(200);
        expect(response.body.data).to.have.property("token");
        expect(response.body).to.be.an('object');
        expect(response.body.data.type).to.equal("success");
        expect(response.body.data.token).to.be.a("string");
        chai.assert.isAtLeast(response.body.data.token.length, 150)
    });
    it('login, missing password', async () => {
        const userData = {
            email: "test@test.com",
            password: null,
        };
        const response = await chai.request(server).post('/login').send(userData);
        expect(response).to.have.status(401);
    });
    it('login, wrong email', async () => {
        const userData = {
            email: "unregistered@test.com",
            password: "somepassw",
        };
        const response = await chai.request(server).post('/login').send(userData);
        expect(response).to.have.status(401);
        expect(response.body.errors.detail).to.equal("User with provided email not found.");
    });
    it('login, wrong password', async () => {
        const userData = {
            email: "test@test.com",
            password: "incorrect",
        };

        const response = await chai.request(server).post('/login').send(userData);

        expect(response).to.have.status(401);
    });
    it('login, bcrypt error', async () => {
        const userData = {
            email: "test@test.com",
            password: "incorrect",
        };

        const bcryptStub = sinon.stub(bcrypt, 'compare').callsArgWith(2, new Error('Bcrypt error'));

        const response = await chai.request(server).post('/login').send(userData);

        expect(response).to.have.status(500);

        bcryptStub.restore();
    });
    it('should handle database error', (done) => {
        const reqBody = {
            email: 'test@example.com',
            password: 'password123'
        };

        const databaseStub = sinon.stub(database, 'getDb').throws(new Error('Database error'));

        chai.request(server)
            .post('/login')
            .send(reqBody)
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body.errors.title).to.equal('Database error');
                expect(res.body.errors.detail).to.equal('Database error');
                databaseStub.restore();
                done();
            });
    });
    it('should throw error when jwt can\'t verify', () => {
        const context = {
            headers: {
                'x-access-token': 'incorrect-token'
            }
        };

        try {
            checkGQToken(context);
        } catch (e) {
            expect(e.message).to.include('Failed authentication');
        };
    });
    it('register new user', async () => {
        const another = "another@test.com"
        const userData = {
            email: another,
            password: "test2",
        };
        const response = await chai.request(server).post('/register').send(userData);
        expect(response).to.have.status(201);
        setTimeout(async () => {
            const db = await database.getDb();
            const filter = {
                email: another
            }
            const newUser = await db.collection.tickets.findOne(filter);
            chai.assert.equal(newUser.email, another);
            await db.client.close();
        }, 5000);
    });

    it('cannot register duplicate user', (done) => {
        const userData = {
            email: "test@test.com",
            password: password,
        };


        chai.request(server)
        .post('/register')
        .send(userData)
        .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res.body.errors.detail).to.contain("duplicate key error collection");
            done();
        });
    });
    it('should handle bcrypt error', (done) => {
        const reqBody = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User'
        };

        const bcryptStub = sinon.stub(bcrypt, 'hash').callsArgWith(2, new Error('Bcrypt error'));

        chai.request(server)
            .post('/register')
            .send(reqBody)
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body.errors.title).to.equal('bcrypt error');
                expect(res.body.errors.detail).to.equal('bcrypt error');
                bcryptStub.restore();
                done();
            });
    });
    it('cannot register with missing email', async () => {
        const userData = {
            email: "oneMore@test.com",
            password: null,
        };
        const response = await chai.request(server).post('/register').send(userData);
        expect(response).to.have.status(401);
        expect(response.body.errors.detail).to.equal('Email or password missing in request');
    });
});

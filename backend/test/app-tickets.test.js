/* global it describe */

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
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


describe('tickets get and post routes', () => {
    before(async () => {
        const db = await database.getDb();
        await db.collection.tickets.deleteMany();
        await db.collection.users.deleteMany();
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
        const allUsers = await db.collection.users.find({}).toArray();
        console.log(allUsers);
        // const allTickets = await db.collection.tickets.find({}).toArray();
        // console.log(allTickets);
        await db.client.close();
    });
    it('page should contain json with old tickets', async () => {
        const query = `{
            tickets {
                code
                trainnumber
            }
        }`

        const response = await chai.request(server)
            .post("/graphql")
            .set("x-access-token", jwtToken)
            .set('Content-Type', 'application/json')
            .send({ query })

        expect(response.res.text).to.include(`{"data":{"tickets":[{"code":"ANA003","trainnumber":"91234"},{"code":"ANA002","trainnumber":"9123"}]}}`)
    });
    it('request missing token', (done) => {
        chai.request(server)
            .get("/tickets")
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property("errors");
                res.body.errors.source.should.equal("/tickets");
                done();
            });
    });
    it('should not access post route without token', async () => {
        const ticketData = {
            code: 'test_code',
            trainnumber: '123456',
            traindate: '2023-09-16'
        };
        const response = await chai.request(server).post('/tickets').send(ticketData);
        expect(response).to.have.status(401);
        expect(response.body.errors.source).to.equal("/tickets");
    });
    it('should not access put route without token', async () => {
        const ticketData = {
            _id: new ObjectId("000000013b7eef17104f27e5"),
            code: 'update_code',
            trainnumber: '123456',
            traindate: '2023-09-16'
        };
        const response = await chai.request(server).put('/tickets').send(ticketData);
        expect(response).to.have.status(401);
        expect(response.body.errors.source).to.equal("/tickets");

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
            code: 'update_code',
            // trainnumber: '123456',
            // traindate: '2023-09-16'
        };
        const mutation = `
            mutation {
                updateTicket (_id: "${ticketData._id}", code: "${ticketData.code}")
                {
                    code
                    trainnumber
                }
            }
        `
        // const response = await chai.request(server).put('/tickets').set("x-access-token", jwtToken).send(ticketData);
        const response = await chai.request(server)
            .post("/graphql")
            .set("x-access-token", jwtToken)
            .set('Content-Type', 'application/json')
            .send({ query: mutation })
        
        console.log(response)

        expect(response).to.have.status(200);
        expect(response.res.text).to.include('{"data":{"updateTicket":{"code":"update_code","trainnumber":"9123"}}}');

        const db = await database.getDb();
        const filter = {
            _id: new ObjectId("000000013b7eef17104f27e5")
        }
        const updated = await db.collection.tickets.findOne(filter);
        chai.assert.equal(updated.code, "update_code");
        await db.client.close();
    });
    it('should not access delete route without token', async () => {
        const ticketData = {
            _id: new ObjectId("000000023b7eef17104f27e6"),
        };
        const response = await chai.request(server).delete('/tickets').send(ticketData);
        expect(response).to.have.status(401);
        expect(response.body.errors.source).to.equal("/tickets");
        const db = await database.getDb();
        const notDeleted = await db.collection.tickets.findOne(ticketData);
        chai.assert.equal(notDeleted.trainnumber, 91234);
        await db.client.close();

    });
    it('Delete a ticket', async () => {
        const ticketData = {
            _id: new ObjectId("000000023b7eef17104f27e6"),
        };
        const response = await chai.request(server).delete('/tickets').set("x-access-token", jwtToken).send(ticketData);
        expect(response).to.have.status(201);
        expect(response.body.data.message).to.equal("Ticket 000000023b7eef17104f27e6 has been deleted");
        const db = await database.getDb();
        const deleted = await db.collection.tickets.findOne(ticketData);
        chai.assert.isNull(deleted);
        await db.client.close();

    });
    it('should create a new ticket via POST request', async () => {
        const ticketData = {
            code: 'test_code',
            trainnumber: '123456',
            traindate: '2023-09-16'
        };
        const response = await chai.request(server).post('/tickets').set("x-access-token", jwtToken).send(ticketData);
        expect(response).to.have.status(201);
        expect(response.body.data).to.have.property("acknowledged");
        expect(response.body).to.be.an('object');
        expect(response.body.data.acknowledged).to.equal(true);
        expect(response.body.data.insertedId).to.be.a("string");

        if (response.body.data.acknowledged === true) {
            setTimeout(async () => {
                const id = await JSON.parse(response.text).data.insertedId;
                const db = await database.getDb();
                const latest = await db.collection.tickets.findOne({
                    _id: new ObjectId(id)
                });

                chai.assert.equal(notDeleted.trainnumber, 91234);
                await db.client.close();
                chai.assert.equal(latest.code, 'test_code');
            }, 5000);
        }
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
    it('cannot register duplicate user', async () => {
        const userData = {
            email: "test@test.com",
            password: password,
        };
        const response = await chai.request(server).post('/register').send(userData);
        expect(response).to.have.status(500);
        expect(response.body.errors.detail).to.contain("duplicate key error collection")
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

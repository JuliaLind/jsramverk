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


describe('tickets get and post routes', () => {
    before(async () => {
        const db = await database.getDb();
        await db.collection.tickets.deleteMany();
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
        // const allTickets = await db.collection.tickets.find({}).toArray();
        // console.log(allTickets);
        await db.client.close();
    });
    it('page should contain json with old tickets', (done) => {
        chai.request(server)
            .get("/tickets")
            .set("x-access-token", jwtToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("data");
                res.body.data.should.be.an("array");
                res.body.data[0]["trainnumber"].should.equal("9123");
                res.body.data[1]["code"].should.equal("ANA003");
                done();
            });
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
            trainnumber: '123456',
            traindate: '2023-09-16'
        };
        const response = await chai.request(server).put('/tickets').set("x-access-token", jwtToken).send(ticketData);
        expect(response).to.have.status(201);
        expect(response.body.data.ticket.code).to.equal("update_code");

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
});

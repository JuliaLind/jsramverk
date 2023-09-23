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

const database = require("../db/database.js");
const collectionName = "trains";

describe('tickets get and post routes', () => {
    before(async () => {
        const db = await database.getDb();
        await db.collection.drop();
        const docs = [
            { code: "ANA002", trainnumber: "9123", traindate: "2023-09-18" },
            { code: "ANA003", trainnumber: "91234", traindate: "2023-09-18" },
        ];
        await db.collection.insertMany(docs);
        await db.client.close();
    });
    it('page should contain json with old tickets', (done) => {
        chai.request(server)
            .get("/tickets")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("data");
                res.body.data.should.be.an("array");
                res.body.data[0]["trainnumber"].should.equal("9123");
                res.body.data[1]["code"].should.equal("ANA003");
                done();
            });
    });
    it('should handle /tickets route', async () => {
        const response = await chai.request(server).get('/tickets');
        expect(response).to.have.status(200);
    });
    it('should create a new ticket via POST request', async () => {
        const ticketData = {
            code: 'test_code',
            trainnumber: '123456',
            traindate: '2023-09-16'
        };
        const response = await chai.request(server).post('/tickets').send(ticketData);
        expect(response).to.have.status(201);
        expect(response.body.data).to.have.property("acknowledged");
        expect(response.body).to.be.an('object');
        expect(response.body.data.acknowledged).to.equal(true);
        expect(response.body.data.insertedId).to.be.a("string");

        console.log("returned data, res1: ", await JSON.parse(response.text).data);
        if (response.body.data.acknowledged === true) {
            setTimeout(async () => {
                const id = await JSON.parse(response.text).data.insertedId;

                const response2 = await chai.request(server).get('/tickets')
                console.log("returned data, res2: ", await JSON.parse(response2.text).data);
                const tickets = await JSON.parse(response2.text).data;
                const latest = tickets.filter(ticket => ticket._id === id)[0];
                chai.assert.equal(latest.code, 'test_code');
            }, 5000);
        }

    });
});

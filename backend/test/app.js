/* global it describe */

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
chai.should();
chai.use(chaiHttp);
chai.use(require('chai-json'));

const database = require("../db/database.js");
const collectionName = "trains";

describe('app', () => {
    describe('GET /', () => {
        it('page should contain json with string "Hello world"', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("data");
                    res.body.data.should.be.a("string");
                    res.body.data.should.equal("Hello World!");
                    done();
                });
        });
    });
    describe('GET /codes', () => {
        it('page should contain json with all codes"', (done) => {
            chai.request(server)
                .get("/codes")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("array");
                    res.body.data.should.have.nested.property("[0].Level1Description");
                    done();
                });
        });
    });
    describe('GET /delayed', () => {
        it('page should contain json with delayed trains"', (done) => {
            chai.request(server)
                .get("/delayed")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("array");
                    done();
                });
        });
    });
    describe('GET and Post /tickets', () => {
        beforeEach(() => {
            return new Promise(async (resolve) => {
                const db = await database.getDb();
    
                db.db.listCollections(
                    { name: collectionName }
                )
                .next()
                .then(async function(info) {
                    await db.collection.drop();
                    // if (info) {
                    //     await db.collection.drop();
                    // }
                    const docs = [
                        { code: "ANA002", trainnumber: "9123", traindate: "2023-09-18" },
                        { code: "ANA003", trainnumber: "91234", traindate: "2023-09-18" },
                    ];
                    await db.collection.insertMany(docs);
                    
                })
                .catch(function(err) {
                    console.error(err);
                })
                .finally(async function() {
                    await db.client.close();
                    resolve();
                });
            });
        });
        it('page should contain json with old tickets', (done) => {
            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("array");
                    res.body.data[0]["trainnumber"].should.equal("9123");
                    res.body.data[1]["code"].should.equal("ANA003");
                    done();
                });
        });
        it('register a new ticket', (done) => {
            const ticket = {
                code: "ANA999", trainnumber: "99991", traindate: "2023-09-19"
            }
            chai.request(server)
                .post("/tickets")
                .send(ticket)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.data.should.have.property("acknowledged");
                    res.body.data.acknowledged.should.equal(true);
                    res.body.data.insertedId.should.be.a("string");
                    // done();
                });
            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data[2].trainnumber.should.equal("99991");
                    res.body.data[2].code.should.equal("ANA999");
                    done();
                });
        });
    });
});

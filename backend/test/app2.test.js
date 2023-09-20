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
});

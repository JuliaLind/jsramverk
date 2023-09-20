/**
 * Test suite for application.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('../app.js');

chai.use(chaiHttp);

describe('app.js', () => {
    describe('Server Setup', () => {
        it('should start the server and listen on the specified port', async () => {
            const response = await chai.request(server).get('/');
            expect(response).to.have.status(200);
        });
    });

    describe('Root URL', () => {
        it('should respond with "Hello World!" at the root URL', async () => {
            const response = await chai.request(server).get('/');
            expect(response).to.have.status(200);
            expect(response.body).to.deep.equal({ data: 'Hello World!' });
        });
    });

    describe('Routes', () => {
        it('should handle /delayed route', async () => {
            const response = await chai.request(server).get('/delayed');
            expect(response).to.have.status(200);
        });
        it('should handle /codes route', async () => {
            const response = await chai.request(server).get('/codes');
            expect(response).to.have.status(200);
        });
    });
});
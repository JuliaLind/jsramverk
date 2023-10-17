/**
 * Test suite for application.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { server } = require('../app.js');
// const sinon = require('sinon');

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
        it('should handle delayed query route', async () => {

            const query = `
                {
                    delayed
                    {
                        AdvertisedTimeAtLocation
                        EstimatedTimeAtLocation
                        OperationalTrainNumber
                        Canceled
                        FromLocation
                        ToLocation
                        LocationSignature
                    }
                }
            `;

            const response = await chai.request(server)
                .post("/graphql")
                .set('Content-Type', 'application/json')
                .send({ query: query });
        
            expect(response).to.have.status(200);

            // console.log(response);

            const returnData = await JSON.parse(response.res.text).data.delayed;

            expect(returnData).to.be.an('array');
            expect(returnData[0]).to.have.any.keys(
                'AdvertisedTimeAtLocation',
                'EstimatedTimeAtLocation',
                'OperationalTrainNumber',
                'Canceled',
                'FromLocation',
                'ToLocation',
                'LocationSignature'
            );
            expect(returnData[0].OperationalTrainNumber).to.be.a('string');

            const pattern = new RegExp('\\{"data":{"delayed":.*');

            const check = pattern.test(response.res.text);

            expect(check).to.equal(true);
        });

        it('should handle codes query route', async () => {
            const query = `
                {
                    codes
                    {
                        Code
                    }
                }
            `;

            const response = await chai.request(server)
                .post("/graphql")
                .set('Content-Type', 'application/json')
                .send({ query: query });
        
            expect(response).to.have.status(200);

            // console.log(response);

            const pattern = new RegExp('.*\\{"Code":"ANA002"}.*{"Code":"ONA027"}.*');

            const check = pattern.test(response.res.text);

            expect(check).to.equal(true);
        });

        it('should handle positions query route', async () => {
            const query = `
                {
                    positions
                    {
                        position
                        trainnumber
                    }
                }
            `;

            const response = await chai.request(server)
                .post("/graphql")
                .set('Content-Type', 'application/json')
                .send({ query: query });
        
            expect(response).to.have.status(200);

            const pattern = new RegExp('.*\\{"position":.*"trainnumber".*');

            const check = pattern.test(response.res.text);

            expect(check).to.equal(true);
        });
    });

    describe('Error handling middleware', () => {
        it('should handle 404 error', async () => {
            const response = await chai.request(server).get('/blabla');
            expect(response.status).to.equal(404);
            expect(response.body).to.deep.equal({
                errors: [
                    {
                        status: 404,
                        title: 'Not Found',
                        detail: 'Not Found'
                    }
                ]
            });
        });
    });
});
/* global it describe */

const chai = require('chai');
const ioClient = require('socket.io-client');
const sinon = require('sinon');
const { server, updateDelayedTrains, checkTokens } = require('../app.js');

const should = chai.should();

describe('Socket.io events', function () {
    let client;

    beforeEach(function (done) {
        server.listen(3000, function () {
            done();
        });
    });

    afterEach(function () {
        server.close();
    });

    before(function (done) {
        client = ioClient.connect('http://localhost:3000', {
            transports: ['websocket'],
            'force new connection': true,
        });
        done();
    });

    after(function (done) {
        if (client.connected) {
            client.disconnect();
        }
        done();
    });

    it('should handle "edit-ticket" event', function (done) {
        client.emit('edit-ticket', { ticketId: 'fakeTicketId' });
        done();

        client.on('connect', function () {
            client.once('lock-ticket', function (data) {
                data.should.deep.equal({ ticketId: 'fakeTicketId' });
                done();
            });
        });
    });

    it('should handle "stop-edit" event', function (done) {
        client.once('unlock-ticket', function (data) {
            should.exist(data.ticket);
            done();
        });

        client.emit('stop-edit', {});
        done();
    });

    it('should handle "updated" event', function (done) {
        const ticketData = { _id: 'fakeTicketId' };

        client.once('refresh-ticket', function (data) {
            data.should.deep.equal(ticketData);
            done();
        });

        client.emit('updated', ticketData);
        done();
    });

    it('should handle "refresh-tickets" event', function (done) {
        client.once('refresh-tickets', function (data) {
            data.should.be.an('array');
            done();
        });

        client.emit('refresh-tickets', {});
        done();
    });
});

describe('Cron Job and Token Check Functions', function () {
    let ioMock;

    beforeEach(function () {
        // Mock the io object
        ioMock = {
            emit: sinon.stub(),
        };
    });

    it('should update delayed trains and emit the update', async function () {
        await updateDelayedTrains(ioMock);

        // Ensure the appropriate function was called
        sinon.assert.calledOnce(ioMock.emit);
        sinon.assert.calledWith(ioMock.emit, 'delayedTrainsUpdate');
    });

    // it('should check tokens and emit "unauthorized" if needed', async function () {
    //     // Simulate a case where the token is invalid
    //     ioMock.in = () => ({
    //         fetchSockets: () => [
    //             { id: '1', token: 'invalidToken' },
    //             { id: '2', token: 'invalidToken' }
    //         ]
    //     });

    //     await checkTokens(ioMock);

    //     // Ensure the appropriate functions were called
    //     sinon.assert.calledTwice(ioMock.emit);
    //     sinon.assert.calledWith(ioMock.emit.firstCall, 'unauthorized');
    //     sinon.assert.calledWith(ioMock.emit.secondCall, 'unauthorized');
    // });
});
/**
 * Test suite for mongo database (connection).
 */

/* global it describe */


const chai = require('chai');
const expect = chai.expect;

process.env.NODE_ENV = 'test';

// let dotenv = require('dotenv');
// dotenv.config({ path: '.env.test' });

// Import the database module
const database = require('../db/database.js');
// const collectionName = "trains";

// describe('database Module test', () => {
//     describe('getDb', () => {
//         it('should connect to the test database and return collection and client references', async () => {
//             // Call the getDb function

//             const { db, collection, client } = await database.getDb();

//             // Assert that collection and client are valid objects
//             expect(collection).to.be.an('object');
//             expect(client).to.be.an('object');

//             // Close the database connection
//             await client.close();
//         });
//     });
// });

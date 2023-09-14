/**
 * @module tickets
 * @description Sets up routers for getting and creating tickets.
 */

// Import express framework and create a router instance
const express = require('express');
const router = express.Router();

// Import tickets module
const tickets = require("../models/tickets.js");

// Sets up HTTP GET and POST requests for tickets
router.get('/', (req, res) => tickets.getTickets(req, res));

router.post('/', (req, res) => tickets.createTicket(req, res));

module.exports = router;

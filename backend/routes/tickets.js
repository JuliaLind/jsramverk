// /**
//  * @module tickets
//  * @description Sets up routers for getting and creating tickets.
//  */

// // Import express framework and create a router instance
// const express = require('express');
// const router = express.Router();

// // Import tickets module
// const tickets = require("../models/tickets.js");
// const auth = require("../models/auth.js");

// // Sets up HTTP GET, POST, PUT and DELETE requests for tickets
// router.get('/',
//     (req, res, next) => auth.checkToken(req, res, next),
//     (req, res) => tickets.getTickets(req, res)
// );


// router.post('/',
//     (req, res, next) => auth.checkToken(req, res, next),
//     (req, res) => tickets.createTicket(req, res)
// );

// router.put('/',
//     (req, res, next) => auth.checkToken(req, res, next),
//     (req, res) => tickets.updateTicket(res, req)
// );

// router.delete('/',
//     (req, res, next) => auth.checkToken(req, res, next),
//     (req, res) => tickets.deleteTicket(res, req)
// );

// module.exports = router;

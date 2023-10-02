const express = require('express');
const router = express.Router();

const auth = require("../models/auth.js");

router.post('/', (req, res) => auth.login(res, req.body));

module.exports = router;

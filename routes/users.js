var express = require('express');
var router = express.Router();
const users = require('../data-access/users');
const responder = require('./responder');

/* GET users listing. */
router.put('/register', async function(req, res, next) {
  const responseFromDB = await users.register(req.body);
  responder.sendResponseFirstRow(res, responseFromDB);
})
  
router.post('/login', async function(req, res, next) {
  const responseFromDB = await users.login(req.body.email);
  responder.sendResponseFirstRow(res, responseFromDB);
})

module.exports = router;

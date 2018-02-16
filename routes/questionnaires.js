var express = require('express');
var router = express.Router();
const questionnaires = require('../data-access/questionnaires');
const responder = require('./responder');

router.get('/list/:userId', async function (req, res, next) {
  const responseFromDB = await questionnaires.getQuestionnaires(req.params.userId);
  responder.sendResponse(res, responseFromDB);
})
router.get('/questionnaire/:id', async function (req, res, next) {
  const responseFromDB = await questionnaires.getQuestionnaire(req.params.id);
  responder.sendResponse(res, responseFromDB);
})

router.put('/save', async function(req, res, next) {
  const responseFromDB = await questionnaires.saveQuestions(req.body);
  responder.sendResponse(res, responseFromDB);
})

router.put('/add', async function (req, res, next) {
  const responseFromFB = await questionnaires.addQuestionnaire(req.body);
  responder.sendResponse(res, responseFromFB);
})

router.post('/answers', async function (req, res, next) {
  const responseFromDB = await questionnaires.getQuestionsWithAnswers(req.body);
  responder.sendResponse(res, responseFromDB);
})


module.exports = router;

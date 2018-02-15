const db = require('../data-access/db');

class questionnaires {
  async getQuestionnaires(userId) {
    const sqlCommand = `SELECT id, name, 
                        EXISTS(SELECT * FROM public."userQuestionnaireStatus" WHERE "questionnaireId" = public.questionnaire.id
                        AND "userId" = $1) as "isCompleted" FROM public.questionnaire`;
    const values = [userId];

    var response = await db.query(sqlCommand, values);
    return response;
  }

  async getChoices(response) {
    let sqlCommandGetChoices = 'SELECT * FROM public.choice c where c."questionId" IN ('
    for (let i = 0; i < response.data.length; i++) {
      sqlCommandGetChoices += response.data[i].id;
      sqlCommandGetChoices += (i < response.data.length - 1) ? ',' : '';
    }
    sqlCommandGetChoices += ')';

    var response2 = await db.query(sqlCommandGetChoices);

    if (response2.isSuccess) {
      for (let i = 0; i < response.data.length; i++) {
        response.data[i].choices = [];
        for (let j = 0; j < response2.data.length; j++) {
          if (response2.data[j].questionId == response.data[i].id) {
            response.data[i].choices.push(response2.data[j].text);
          }
        }
      }
    }

    return response;
  }

  async getQuestionnaire(id) {
    const sqlCommand = 'SELECT * from public.question q where q."questionnaireId" = $1';
    const values = [id];

    var response = await db.query(sqlCommand, values);
    if (response.isSuccess) {
      response = await this.getChoices(response);
    }
    return response;
  }

  async saveQuestions(request) {
    const response = await this.insertAnswers(request);

    if (response.isSuccess) {
      const response2 = await this.updateQuestionnaireStatus(request);
      return response2;
    } else {
      return response;
    }
  }

  async insertAnswers(request) {
    console.log(request);
    let sqlCommand = 'INSERT INTO public.answer("userId", "questionnaireId", "questionId", text) VALUES ';
    for (let i = 0; i < request.questions.length; i++) {
      if (request.questions[i].answerType != 2) {
        sqlCommand += '('
          + request.userId + ','
          + request.questions[i].questionnaireId + ','
          + request.questions[i].id + ','
          + "'" + request.questions[i].answer.replace("'", "''") + "'" + ')';
      } else {
        for (let j = 0; j < request.questions[i].answers.length; j++) {
          sqlCommand += '('
            + request.userId + ','
            + request.questions[i].questionnaireId + ','
            + request.questions[i].id + ','
            + "'" + request.questions[i].answers[j] + "'" + ')'
            + (j < request.questions[i].answers.length - 1 ? ',' : '');
        }
      }

      sqlCommand += (i < request.questions.length - 1 ? ',' : '');
    }

    var response = await db.query(sqlCommand);

    return response;
  }

  async updateQuestionnaireStatus(request) {
    let sqlCommand = 'INSERT INTO public."userQuestionnaireStatus"("userId", "questionnaireId") VALUES($1, $2)';
    let values = [request.userId, request.questions[0].questionnaireId];

    var response = await db.query(sqlCommand, values);

    return response;
  }

  async addQuestionnaire(request) {
    var response = await this.insertQuestionnaire(request);

    if (response.isSuccess) {
      var response2 = await this.insertQuestions(request, response.data[0].id);
      if (response2.isSuccess) {
        for (let i = 0; i < request.questions.length; i++) {
          request.questions[i].id = response2.data[i].id;
        }

        var response3 = await this.insertChoices(request);
        return response3;
      }

      return response2;
    }

    return response;
  }

  async insertQuestionnaire(request) {
    let sqlCommand = 'INSERT INTO public.questionnaire("name") VALUES($1) RETURNING *';
    let values = [request.name];

    var response = await db.query(sqlCommand, values);
    return response;
  }

  async insertQuestions(request, questionnaireId) {
    let sqlCommand = 'INSERT INTO public.question("questionText", "questionnaireId", "answerType") VALUES ';

    for (let i = 0; i < request.questions.length; i++) {
      sqlCommand += '('
        + "'" + request.questions[i].questionText + "'" + ','
        + questionnaireId + ','
        + request.questions[i].answerType + ')'
        + (i < request.questions.length - 1 ? ',' : '');
    }

    sqlCommand += ' RETURNING *';

    var response = await db.query(sqlCommand);
    return response;
  }

  async insertChoices(request) {
    let sqlCommand = 'INSERT INTO public.choice("text", "questionId") VALUES';

    const questionsWithChoices = request.questions.filter(q => q.choices[0]);

    for (let i = 0; i < questionsWithChoices.length; i++) {
      for (let j = 0; j < questionsWithChoices[i].choices.length; j++) {
          sqlCommand += '('
            + "'" + questionsWithChoices[i].choices[j] + "'" + ','
            + questionsWithChoices[i].id + ')'
            + ((i == questionsWithChoices.length - 1)
              && (j == questionsWithChoices[i].choices.length - 1) ? '' : ',');
      }
    }

    var response = await db.query(sqlCommand);
    return response;
  }
}


module.exports = new questionnaires();
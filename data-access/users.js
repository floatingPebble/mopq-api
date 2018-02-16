const db = require('../data-access/db');

class users {
  async register(user) {
    const sqlCommand = 'INSERT INTO public.user("firstName", "lastName", email) VALUES($1, $2, $3) RETURNING *';
    const values = [user.firstName , user.lastName, user.email];

    var response = await db.query(sqlCommand, values);
    return response;
  }

  async login(email) {
    const sqlCommand = 'SELECT * FROM public.user WHERE email=$1';
    const values = [email];

    var response = await db.query(sqlCommand, values);
    return response;
  }

  async getUsers() {
    const sqlCommand = 'SELECT * FROM public.user WHERE "isAdmin" is NULL';
    var response = await db.query(sqlCommand);
    return response;
  }
}

module.exports = new users();
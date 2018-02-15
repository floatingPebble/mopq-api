const { Pool } = require('pg');
const pool = new Pool({
  user: 'gollosus',
  host: 'localhost',
  database: 'mopq',
  port: 5432
});

module.exports = {
  query: async function (command, values){
    const client = await pool.connect();
    let response = {
      isSuccess: false,
      data: {},
      error: ''
    };

    try {
      console.log(command);
      const res = await client.query(command, values);
      response.data = res.rows;
      response.isSuccess = true;
    } catch(err) {
      console.log('query error: ' + err.stack);
      response.error = err.stack;
    } finally {
      client.release();
    }

    return response;
  }
};
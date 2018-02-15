module.exports = {
  sendResponseFirstRow: function (res, responseFromDB){
    res.status(responseFromDB.isSuccess ? 200 : 500)
    .send(responseFromDB.isSuccess 
      ? JSON.stringify( responseFromDB.data[0] ) 
      : responseFromDB.error )
    .end();
  },
  sendResponse: function (res, responseFromDB){
    res.status(responseFromDB.isSuccess ? 200 : 500)
    .send(responseFromDB.isSuccess 
      ? JSON.stringify( responseFromDB.data ) 
      : responseFromDB.error )
    .end();
  }
};
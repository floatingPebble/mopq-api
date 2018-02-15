module.exports = function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Custom-Header');    

  if(req.method == 'OPTIONS') {
    return res.status(200).end();
  }

  return next();
}
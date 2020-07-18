
var repoHelper = require('../services/repository');
var library = {};

library.sum = (req) =>{
  var a = req.a;
  var b = req.b;

  var sum = a + b;

  return repoHelper.createResponseData(200,'SUCCESS',3,null);
}

library.min = (req) =>{
  var a = req.a;
  var b = req.b;

  var sum = a - b;

  return repoHelper.createResponseData(200,'SUCCESS',sum,null);
}
module.exports=library
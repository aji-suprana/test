var library = {}

library.createResponseData = (statusCode,status,data,message)=>
{
  return {
    statusCode : statusCode,
    status : status,
    data : data,
    message: message
  }
}

module.exports = library;
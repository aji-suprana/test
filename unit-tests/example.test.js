const exampleRepo = require('../app/repository/example')

test('adds 1 + 1',()=>{
  var request = 
  {
    body:{
      a : 1,
      b : 2
    }
  }

  var response = 
  {
    'statusCode' : 200,
    'status' : 'SUCCESS',
    'data' : 3,
    'message' : null
  }
  expect(exampleRepo.sum(request)).toStrictEqual(response);
})
const fileSystem = require('../app/services/fileSystem');
const decryptToken = require('../app/middlewares/decrypt-jwt-token');
const debug = require('../app/services/debug')
var routers = [];

fileSystem.listAllFile(__dirname, '.js', false, requireAllRouter);

function requireAllRouter(fileName) {
  var requiredFile = './' + fileName;
  if (fileName != 'index') {
    var curRoute = require(requiredFile);
    var path = '/' + fileName;
    routers.push({
      path: path,
      routeProps: curRoute,
    });
  }
}

debug.logHeader('registered routes')
routers.forEach(route=>{
  route.routeProps.route.stack.forEach(childRoute=>{
    debug.logData(route.path, childRoute.route.path)
  })
})

module.exports = (app) => {
  routers.forEach((item, index) => {
    var middlewares = []
    if(item.routeProps.needAuth == true)
    {
      middlewares.push(decryptToken);
    }
    app.use(item.path,middlewares, item.routeProps.route);
  });
};

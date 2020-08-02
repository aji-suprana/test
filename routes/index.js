const fileSystem = require('../app/services/fileSystem');
const decryptToken = require('../app/middlewares/decrypt-jwt-token');
const debug = require('../app/services/debug')
const fs = require('fs')
const path = require('path')
var routers = [];
var routePaths = []
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
    routePaths.push(path);
  }
}

debug.logHeader('registered routes')
routers.forEach(route=>{
  route.routeProps.route.stack.forEach(childRoute=>{
    debug.logData(route.path, childRoute.route.path)
  })
})

module.exports = (app) => {
    var packageRaw = fs.readFileSync(path.join(__dirname,'../package.json'));
    var packageJSON = JSON.parse(packageRaw);

    debug.logData("package",packageJSON)
    /* GET home page. */
    app.get("/", function (req, res, next) {
      // res.status(200).json({
      //   test:"halohalo"
      // });
      res.render("index", {
        title: packageJSON.name,
        env: process.env.NODE_ENV,
        port: process.env.PORT || 3000,
        endPoints: routePaths
    });
  });

  routers.forEach((item, index) => {
    var middlewares = []
    if(item.routeProps.needAuth == true)
    {
      middlewares.push(decryptToken);
    }
    app.use(item.path,middlewares, item.routeProps.route);
  });
};

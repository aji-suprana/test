const envSet = require('../environments');

module.exports = {
  apps : [{
    name: "upmesh-live:production",
    script: "./bin/www",
    watch       : true,
    env: envSet["development"],
    env_staging: envSet["staging"],
    env_production:envSet["production"]
  }]
}
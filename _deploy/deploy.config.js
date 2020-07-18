module.exports = {
  deploy : {
    production : {
      key : "./_deploy/upmesh",
      user : "ubuntu",
      host : ["api.upmesh.io"],
      ref  : "origin/master",
      ssh_options: "StrictHostKeyChecking=no",
      repo : "git@github.com:upmeshlive/upmesh-backend.git",
      path : "/home/ubuntu/app/upmesh-api-production",
      "post-setup" : "sudo npm install;",
      "post-deploy" : "npx sequelize db:migrate --env production;sudo pm2 startOrRestart ./_deploy/production.config.js --env production"
     },
     staging : {
      key : "./_deploy/upmesh",
      user : "ubuntu",
      host : ["api.upmesh.io"],
      ref  : "origin/release/v0.1",
	     ssh_options: "StrictHostKeyChecking=no",

      repo : "git@github.com:upmeshlive/upmesh-backend.git",
      path : "/home/ubuntu/app/upmesh-api-staging",
      "post-setup" : "sudo npm install;",
      "post-deploy" : "npx sequelize db:migrate --env staging;sudo pm2 startOrRestart ./_deploy/staging.config.js --env staging"
     },
     development : {
      key : "./_deploy/upmesh",
      user : "ubuntu",
      host : ["api.upmesh.io"],
      ref  : "origin/develop",
	     ssh_options: "StrictHostKeyChecking=no",

      repo : "git@github.com:upmeshlive/upmesh-backend.git",
      path : "/home/ubuntu/app/upmesh-api-development",
      "post-setup" : "sudo npm install;",
      "post-deploy" : "npx sequelize db:migrate;sudo pm2 startOrRestart ./_deploy/development.config.js --env development "
     },
     devlive : {
      key : "./_deploy/upmesh",
      user : "ubuntu",
      host : ["api.upmesh.io"],
      ref  : "origin/release/devlive",
	     ssh_options: "StrictHostKeyChecking=no",

      repo : "git@github.com:upmeshlive/upmesh-backend.git",
      path : "/home/ubuntu/app/upmesh-api-development-live",
      "post-setup" : "sudo npm install;",
      "post-deploy" : "npx sequelize db:migrate;sudo pm2 startOrRestart ./_deploy/development.config.js --env developmentLive"
     }
  }
}

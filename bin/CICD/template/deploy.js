const buildSequelize = require('../jobs/built-test-sequelize')
const uploadImage = require('../jobs/uploadImage')
const deploy = require('../jobs/deploy')


const constructJobs = {}

constructJobs[buildSequelize.name] = buildSequelize.content;
constructJobs[uploadImage.name] = uploadImage.content;
constructJobs[deploy.name] = deploy.content;


module.exports=
{
  "name": "Develop-CD",
  "on": {
    "push": {
      "branches": [
        "develop-stage",
      ]
    }
  },
  "jobs": constructJobs
}
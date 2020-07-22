const buildSequelize = require('../jobs/built-test-sequelize')
const uploadImage = require('../jobs/uploadImage')

const constructJobs = {}

constructJobs[buildSequelize.name] = buildSequelize.content;
constructJobs[uploadImage.name] = uploadImage.content;

module.exports=
{
  "name": "Develop-CD",
  "on": {
    "push": {
      "branches": [
        "develop",
      ]
    }
  },
  "jobs": constructJobs
}
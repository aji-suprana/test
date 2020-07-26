const buildSequelize = require('../jobs/built-test-sequelize')
const uploadImage = require('../jobs/uploadImage')

const constructJobs = {}

constructJobs[buildSequelize.name] = buildSequelize.content;
constructJobs[uploadImage.name] = uploadImage.content;

module.exports=
{
  "on": 
  [
    {
      "pull_request": 
      {
        "branches": 
        [
          "develop-stage",
        ]
      }
    },
    {
      "push":
      {
        "branches": 
        [
          "develop-stage",
        ]
      }
    }
  ],
  "jobs": constructJobs
}
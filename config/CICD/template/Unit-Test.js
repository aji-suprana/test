const CICD_config = require("../CICD_config")
const buildSequelize = require('../jobs/built-test-sequelize')
const constructJobs = {}

constructJobs[buildSequelize.name] = buildSequelize.content;
module.exports=
{
  "name": "Unit-Test",
  "on": {
    "push": {
      "branches": [
        "develop",
      ]
    }
  },
  "jobs": constructJobs
}
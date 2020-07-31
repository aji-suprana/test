const buildSequelize = require('../jobs/built-test-sequelize')
const uploadImage = require('../jobs/uploadImage')

const constructJobs = {}

constructJobs[buildSequelize.name] = buildSequelize.content;
constructJobs[uploadImage.name] = uploadImage.content;

module.exports=
{
<<<<<<< HEAD
  "name": "Develop-CD",
  "on": {
    "push": {
      "branches": [
=======
  "on": 
  {
    "pull_request": 
    {
      "branches": 
      [
        "develop-stage",
      ]
    },
    "push":
    {
      "branches": 
      [
>>>>>>> 4ec7f2037b8bb214d4b27d9aac4db00135576e49
        "develop-stage",
      ]
    }
  },
  "jobs": constructJobs
}
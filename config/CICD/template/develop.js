const CICD_config = require("../CICD_config")
module.exports=
{
  "name": "Continues Integration",
  "on": {
    "push": {
      "branches": [
        "develop",
      ]
    }
  },
  "jobs":   
  {
    "build-test": {
      "name": "Build and Run Unit Test",
      "runs-on": "ubuntu-latest",
      "services":{
        "mysql":{
          "image": 'mysql:5.7',
          "ports" :[3306],
          "env":
          {
            "MYSQL_ROOT_PASSWORD" : "password",
          }
        }
      },
      "steps": [
        {
          "name": "Checkout",
          "uses": "actions/checkout@v1"
        },
        {
          "name": "Extract branch name",
          "shell": "bash",
          "run": "echo \"##[set-output name=branch;]$(echo ${GITHUB_REF#refs/heads/})\"",
          "id": "extract_branch"
        },
        {
          "name": "Install npm",
          "run": "npm install jest"
        },
        {
          "name": "Install sequelize",
          "run": "npm install sequelize-cli"
        },
        {
          "name": "create database",
          "run": "npx sequelize-cli db:create --env test"
        },
        {
          "name": "create database",
          "run": "npx sequelize-cli db:create --env test"
        },
        {
          "name": "Unit Testing",
          "run": "npm test"
        },

      ]
    },
    
    "deploy":{
      "name": "Upload Image to ECR",
      "runs-on": "ubuntu-latest",
      "needs" : "build-test",
      "steps": [

      ]
    },
  }
}
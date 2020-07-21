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
        "mydb":{
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
          "name": "Verify MySQL connection from container",
          "run": "apt-get update\napt-get install -y mysql-client\nmysql --host mydb -uroot -ppassword -e \"SHOW DATABASES\"\n"
        },
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
          "run": "npm install jest\nnpm install sequelize-cli\n"
        },

        {
          "name": "setup test database",
          "run": "NODE_ENV=test npx sequelize-cli db:create --env test \nNODE_ENV=test npx sequelize-cli db:migrate --env test\n"
        },
        {
          "name": "Unit Testing",
          "run": "npm test"
        },

      ]
    },
  }
}
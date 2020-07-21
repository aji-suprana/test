const CICD_config = require("../CICD_config")
module.exports=
{
  "name": "Continues Integration",
  "on": {
    "push": {
      "branches": [
        "master",
        "develop",
        "feature/cicd"
      ]
    }
  },
  "jobs":   
  {
    "ECR-PUSH": {
      "needs":"test",
      "name": "Build Image and Push to ECR",
      "runs-on": "ubuntu-latest",
      "services":{
        "mysql":{
          "image": 'mysql:5.7',
          "ports" :[3306],
          "env":
          {
            "MYSQL_USER": "vobis",
            "MYSQL_PASSWORD" : "vobis12345",
            "MYSQL_DATABASE" : "vobis_authentication_test",
            "MYSQL_ROOT_PASSWORD" : "vobis12345",
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
          "migrate database": "create database",
          "run": "npx sequelize-cli db:create --env test"
        },
        {
          "name": "Unit Testing",
          "run": "npm test"
        },
        {
          "name": "Configure AWS credentials",
          "uses": "aws-actions/configure-aws-credentials@v1",
          "with": {
            "aws-access-key-id": "${{ secrets.AWS_ACCESS_KEY_ID }}",
            "aws-secret-access-key": "${{ secrets.AWS_SECRET_ACCESS_KEY }}",
            "aws-region": "ap-southeast-1"
          }
        },
        {
          "name": "Login to Amazon ECR",
          "id": "login-ecr",
          "uses": "aws-actions/amazon-ecr-login@v1"
        },
        {
          "name": CICD_config.IMAGE_TAG.nodeApp + "IMAGE",
          "id": "build-master-image",
          "env": {
            "ECR_REGISTRY": "${{ steps.login-ecr.outputs.registry }}",
            "ECR_REPOSITORY": CICD_config.ECR_REPOSITORY,
            "IMAGE_TAG": CICD_config.IMAGE_TAG.nodeApp
          },
          "run": "docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -f docker/nodeapp/Dockerfile .\ndocker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG\necho \"::set-output name=image::$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG\"\n"
        },
        {
          "name": "MYSQL image",
          "id": "build-mysql-image",
          "env": {
            "ECR_REGISTRY": "${{ steps.login-ecr.outputs.registry }}",
            "ECR_REPOSITORY": CICD_config.ECR_REPOSITORY,
            "IMAGE_TAG": CICD_config.IMAGE_TAG.nodeApp
          },
          "run": "docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -f docker/db/Dockerfile .\ndocker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG\necho \"::set-output name=image::$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG\"\n"
        }
      ]
    }
  }
}
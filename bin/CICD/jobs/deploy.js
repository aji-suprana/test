const CICD_config = require("../CICD_config")

module.exports={
    "name": "deploy",
    "content":{
        "name": "Upload Image to ECR",
        "runs-on": "ubuntu-latest",
        "needs" : "uploadImage",
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
            "name": "Configure AWS credentials",
            "uses": "aws-actions/configure-aws-credentials@v1",
            "with": {
            "aws-access-key-id": "${{ secrets.AWS_ACCESS_KEY_ID }}",
            "aws-secret-access-key": "${{ secrets.AWS_SECRET_ACCESS_KEY }}",
            "aws-region": "ap-southeast-1"
            }
        },
        {
          "name" : "Deploy Amazon ECS dev-stage & dev-live task definition",
          "uses" : "aws-actions/amazon-ecs-deploy-task-definition@v1",
          "with":
            {
              "task-definition": "task-definition.json",
              "service": "test-service",
              "cluster": "test-cluster",
              "wait-for-service-stability": true   
            }
        }
        ]
    },
}
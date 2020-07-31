module.exports = {
    name : "buildTest",
    content: {
        "name": "Build and Run Unit Test",
        "runs-on": "ubuntu-latest",
        "container": "ubuntu",
        "services": {
            "mydb": {
                "image": "mysql:5.7",
                "env": {
                    "MYSQL_ROOT_PASSWORD": "password"
                },
                "options": "--health-cmd=\"mysqladmin ping\" --health-interval=4s --health-timeout=5s --health-retries=2"
            }
        },
        "steps": [
            {
                "uses": "actions/setup-node@v2-beta",
                "with": {
                    "node-version": "10"
                }
            },
            {
                "name": "Checkout",
                "uses": "actions/checkout@v1"
            },
            {
                "name": ".env generation",
                "run": "node ./env/json_environments"
            },
            {
                "name": "setup test database",
                "run": "npm install sequelize-cli\nNODE_ENV=test npx sequelize-cli db:create --env test \nNODE_ENV=test npx sequelize-cli db:migrate --env test\n"
            },
            {
                "name": "Unit Testing",
                "run": "npm install jest\nnpm test\n"
            }
        ]
    },
}
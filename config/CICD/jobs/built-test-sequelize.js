

module.exports = {
    name : "buildTest",
    content: {
        "name": "Build and Run Unit Test",
        "runs-on": "ubuntu-latest",
        "services": {
            "mysql": {
                "image": "mysql:5.7",
                "env": {
                    "MYSQL_ROOT_PASSWORD": "password"
                },
                "ports": [
                    "3306:3306"
                ],
                "options": "--health-cmd=\"mysqladmin ping\" --health-interval=10s --health-timeout=5s --health-retries=3"
            }
        },
        "steps": [
            {
                "name": "Verify MySQL connection from host",
                "run": "sudo apt-get install -y mysql-client\nmysql --host 127.0.0.1 --port 3306 -uroot -ppassword -e \"SHOW DATABASES\"\n"
            },
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
                "name": "Extract branch name",
                "shell": "bash",
                "run": "echo \"##[set-output name=branch;]$(echo ${GITHUB_REF#refs/heads/})\"",
                "id": "extract_branch"
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
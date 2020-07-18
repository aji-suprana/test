#!/bin/bash
/wait
NODE_ENV=production npx sequelize-cli db:create
NODE_ENV=production npx sequelize-cli db:migrate
npm run start
#!/bin/bash
/wait
NODE_ENV=production npx sequelize db:create
NODE_ENV=production npx sequelize db:migrate
npm run start
#!/bin/bash
/wait
NODE_ENV=staging npx sequelize db:migrate
npm run stage
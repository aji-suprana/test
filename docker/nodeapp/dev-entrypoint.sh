#!/bin/bash
/wait

NODE_ENV=development npx sequelize db:migrate
npm run dev
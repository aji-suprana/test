SETUP="test"
if [ $2 = 'setup' ]
then
  SETUP="setup"
fi

if [ $1 = 'production' ]
then
  echo 'process production'
  pm2 deploy ./_deploy/deploy.config.js production $SETUP
elif  [ $1 = "staging" ]
then 
  echo 'process staging'
  pm2 deploy ./_deploy/deploy.config.js staging $SETUP
elif [ $1 = "development" ]
then
echo 'process development'
pm2 deploy ./_deploy/deploy.config.js development $SETUP
else
echo 'ERROR: specify NODE_ENV at param $1'
fi



#pm2 deploy .\\deploy.config.js production
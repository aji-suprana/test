

var appName = 'vbs-finance_book';
var dbName = 'vbs-finance_book-db';

if(appName == 'sandbox')
{
    console.log('WARNING: NEED TO CHANGE CICD_config.js appName')
}

module.exports=
{
    "ECR_REPOSITORY": "my-ecr-repo",
    "IMAGE_TAG":
    {
        'nodeApp':appName,
        'db' : dbName
    }
}
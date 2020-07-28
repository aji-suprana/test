

var appName = 'vbs-test';

if(appName == 'sandbox')
{
    console.log('WARNING: NEED TO CHANGE CICD_config.js appName')
}

module.exports=
{
    "ECR_REPOSITORY": appName+'-repo',
    "IMAGE_TAG":
    {
        'nodeApp':appName,
        'db' : appName+'-db'
    }
}
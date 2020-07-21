var appName = process.env.APP_NAME;
var dbName = appName +'-db';
console.log(appName);
module.exports=
{
    "ECR_REPOSITORY": "my-ecr-repo",
    "IMAGE_TAG":
    {
        'nodeApp':appName,
        'db' : dbName
    }
}
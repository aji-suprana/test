const yaml = require('js-yaml');
const fs = require('fs');
const util = require('util')
const validation = require('./helper/checkMissingArgs');
const debug = require('../../../app/services/debug');
const recurseFile = require('./helper/recurseFile')
const path = require('path')
// Get document, or throw exception on error

module.exports = (args) => {
    try {
        var argv = args;
        if (!argv._[1]) {
            //argv = validation.CheckMissingArg(argv, "name", "name", "example-service");
            //debug.logError('this script doesnt take arguments')
        }
        else {
            argv.name = argv._[1];
        }

        var name = argv.name;

        // const doc = yaml.safeLoad(fs.readFileSync('./example.yml', 'utf8'));
        // console.log(util.inspect(doc, { showHidden: false, depth: null }))

        // fs.writeFile("test.json", JSON.stringify(doc, null, 2), function (err) {
        //     if (err) {
        //         console.log(err);
        //     }
        // });
        var configPath = path.resolve(__dirname,'../../../config/CICD/template');
        if(!fs.existsSync(configPath))
        {
            debug.logError(configPath + ' does not exist');
        }
        recurseFile.runThroughDirectory(configPath,[],
            (file)=>{
                var fileName = file.split('/');
                var workflow = path.resolve(__dirname,'../../../.github/workflows/');
                fileName = fileName[fileName.length - 1];
                moduleName = fileName.split('.')[0]

                var filePath = path.join(__dirname,'/../../../config/CICD/template/'+fileName)
                var doc = yaml.safeDump(require(filePath));
                fs.writeFile(workflow+'/'+moduleName + ".yaml", doc, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });

            },
            (dir)=>{
                //console.log(dir)
            }
        )
    } catch (err) {
        debug.logError(err);
    }

}

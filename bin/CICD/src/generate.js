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

  
        var doc = yaml.safeLoad(fs.readFileSync(__dirname+'/../../../.github/workflows/develop.yaml','utf-8'));
        fs.writeFile("generated.json", JSON.stringify(doc,null,4), function (err) {
            if (err) {
                console.log(err);
            }
        });
    } catch (err) {
        debug.logError(err);
    }

}

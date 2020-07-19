'use strict';


const fs = require('fs');
const path = require('path');
const debug = require('../../../../app/services/debug');
const regexp = require('regexp');

var validateIgnore = (filePath,ignoreList)=>
{
  var filePath = filePath.replace(/\//g,'\\');
  var isIgnored = false;
  ignoreList.forEach((ignored,index)=>{
    var ignored = ignored.replace(/\//g,'\\\\');
    var regexString = '\\b'+ignored+'\\b';
    var regex = new RegExp(regexString)
    //console.log(regex);
    if(filePath.match(regex))
    {
      debug.logDataYellow('ignored', filePath)
      isIgnored = true;
    }
  })
  return isIgnored;

}

var runThroughDirectory= async (mainDir,ignoreList,ProcessFile,ProcessDir)=>
{
  const files = [];
  const sortDir = (mainDir) => {
    const folders = [];
    const CheckFile = (filePath) => fs.statSync(filePath).isFile();
    const sortPath = (dir) => {
      fs.readdirSync(dir)
        .forEach((res) => {
          const filePath = path.join(dir, res);
          if (CheckFile(filePath) == true) {
            if(validateIgnore(filePath,ignoreList) == false)
            {
              debug.logData('file',filePath);
               ProcessFile(filePath);
              files.push(filePath);
            }
          } else {
            var isIgnored = validateIgnore(filePath,ignoreList);

            if( isIgnored== false)
            {
               ProcessDir(filePath);
              debug.logData('dir',filePath);
              folders.push(filePath);
              sortDir(filePath);
            }
          }
        });
    };
    folders.push(mainDir);
    let i = 0;
    do {
      sortPath(folders[i]);
      i += 1;
    } while (i < folders.length);
  };

  sortDir(mainDir);
  files.forEach((file) => {

  });
}

module.exports = {
  runThroughDirectory
}

//runThroughDirectory(__dirname+'/../../config/template',ignoreList);


//console.log(path.join(__dirname+ '/../../','package.json'))


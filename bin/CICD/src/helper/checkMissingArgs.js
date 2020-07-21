const cli = require('cli-interact');
function CheckMissingArg(args, argName, prompted, defaultVal)
{
  var argv = args;
  if(!argv[argName])
  {
    var answer = cli.question(prompted +" ("+ defaultVal +") :   " );

    if(answer == '')
    {
      answer = defaultVal;
    }

    argv[argName] = answer;
  }

  return argv;
}

module.exports={
  CheckMissingArg
}
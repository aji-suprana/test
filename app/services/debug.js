var lodash = require('lodash');


var colors = {
  Reset : "\x1b[0m",
  Bright : "\x1b[1m",
  Dim : "\x1b[2m",
  Underscore : "\x1b[4m",
  Blink : "\x1b[5m",
  Reverse : "\x1b[7m",
  Hidden : "\x1b[8m",

  FgBlack : "\x1b[30m",
  FgRed : "\x1b[31m",
  FgGreen : "\x1b[32m",
  FgYellow : "\x1b[33m",
  FgBlue : "\x1b[34m",
  FgMagenta : "\x1b[35m",
  FgCyan : "\x1b[36m",
  FgWhite : "\x1b[37m",

  BgBlack : "\x1b[40m",
  BgRed : "\x1b[41m",
  BgGreen : "\x1b[42m",
  BgYellow : "\x1b[43m",
  BgBlue : "\x1b[44m",
  BgMagenta : "\x1b[45m",
  BgCyan : "\x1b[46m",
  BgWhite : "\x1b[47m"
}

function log(message)
{
  if(process.env.NODE_ENV == 'test')
    return;
  console.log(message);
}

function logDataYellow(key,value)
{
  if(process.env.NODE_ENV == 'test')
  return;
  console.log(colors.FgYellow,key,colors.Reset,value);
}

function logData(key,value)
{
  if(process.env.NODE_ENV == 'test')
  return;
  console.log(colors.FgGreen,key,colors.Reset,value);
}

function logHeader(message)
{
  if(process.env.NODE_ENV == 'test')
  return;
  console.log(colors.BgWhite+colors.FgBlack,lodash.toUpper(message),colors.Reset);
  console.log(colors.Reset);
}

function logWarning(message)
{
  if(process.env.NODE_ENV == 'test')
  return;
  console.log(colors.BgYellow+colors.FgWhite,'ERROR',colors.Reset);
  console.log(colors.BgBlack+colors.FgRed,message,colors.Reset);
}


function logSubheader(message)
{
  if(process.env.NODE_ENV == 'test')
  return;
  console.log("===============",lodash.toUpper(message),"===============",colors.Reset);
  console.log(colors.Reset);
}

function logError(message)
{
  if(process.env.NODE_ENV == 'test')
  return;
  console.log(colors.BgRed+colors.FgWhite,'ERROR',colors.Reset);
  console.log(colors.BgBlack+colors.FgRed,message,colors.Reset);
}

module.exports = {
  colors,
  logError,
  log,
  logHeader,
  logSubheader,
  logData,
  logWarning,
  logDataYellow
}
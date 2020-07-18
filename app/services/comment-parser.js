var debug = require('./debug')
var lodash = require('lodash');
module.exports.parseComment = (comment,commentId,commentFrom) => {
    debug.logHeader("parsing comment");
    let result = {}
    result.status = "OK";
    const paramType = typeof (comment);
    lodash.isString(paramType);
    debug.logData('comment',comment)
    debug.logData('paramType', paramType)
    // param is string checking
    if (paramType != 'string') {
        debug.logError(paramType);
        result.status = "ERROR";
        result.message = "INVALID PARAM"
        return result
    }
    debug.logData('comment',comment);
    comment = comment.trim();

    // remove this sign -> ("")
    comment = comment.replace(/"/g, "");

    let array = comment.split(/[\s|+|:]+/);
    debug.logData('array', array);
    // let firstKeyMatch = comment.match(/([a-zA-Z0-9\-]+)([\s|+|:]+)([a-zA-Z0-9\-]+)([\s|+|:]+)(-?\d+$)/g);
    let firstKeyMatch = comment.match(/([a-zA-Z0-9\-]+)([\s|+|:]+)(-?\d+$)/);
    debug.logData("firstKeyMatch", firstKeyMatch);
    if (!firstKeyMatch) {
        result.status = "ERROR";
        result.message = "INVALID COMMENTS"
        return result
    }

    debug.logData('firstKeyMathc',firstKeyMatch);

    // if quantity request < 1
    if (Number.parseInt(array[1]) < 1) {
        console.log(Number.parseInt(array[1]) < 1)
        result.status = "ERROR";
        result.message = "INVALID QUANTITY REQUEST"
        return result
    }

    // result.session = array[0];
    result.product = array[0];
    result.count = Number.parseInt(array[1]);

    return result;
}
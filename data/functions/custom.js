const logger=require("../lib/logger");

// Add you custom functions here.  You can add the logger optionally
// logger supports .error .warn .info .debug .silly
// the functions do not need to start with fn, but we all like consistancy

exports.fnSum = function(a,b) {
  logger.silly("[fnSum] sum is happening")
  return a+b
};
exports.fnMultiply = function(a,b) {
  logger.silly("[fnMultiply] multiply is happening")
  return a*b
};

exports.fnIpRangeToList = function (data, arrtoremove=[]) {
  //const data = '10.5.15.[22-25],10.5.16.[35-37],10.5.17.20';
  // Placeholder for the final result
  var result = [];
  
  // Use the split function to get all your Ips in an array
  const ips = data.split(',');
  
  // Use the built in forEach function to iterate through the array
  ips.forEach(ip => {
    // This regular expression will match the potential extremities of the range
    const regexp = /[0-9]+\.[0-9]+\.[0-9]+\.\[(.*)\-(.*)\]/;
    const match = regexp.exec(ip);
    
    // If it's a range
    if (match && match.length && match[1] && match[2]) {
        // Iterate through the extremities and add the IP to the result array
        for (let i = parseInt(match[1]); i <= parseInt(match[2]); i ++) {
          result.push(ip.match(/[0-9]+\.[0-9]+\.[0-9]+\./i)[0] + i);
        }
    } else { // If it is a single IP
      // Add to the results
      result.push(ip);
    }
  })
  
  //remove items from result if arrremove is provided 
  if (arrtoremove.length > 0) {
    logger.debug("[cfnIpRangetoList] removing:"+arrtoremove+" from list:"+result);   
    result = result.filter(el=>!arrtoremove.includes(el));
  }

  
  //console.log(result);
  logger.debug("[cfnIpRangetoList] translated iprange:"+data+" to list:"+result);   
  return(result);
};
     
//console.log(exports.fnIpRangeToList('10.5.15.[22-25],10.5.16.[35-37],10.5.17.20')); 

exports.fnSaveArg = function(sessionId,key,data) {
  var path = '/app/dist/persistent/';
  var sessionfile = path + 'session_info.'+sessionId.toString();

  var fs = require('fs');
  var obj = {};

  
  if (fs.existsSync(sessionfile)) {
    exsitingdata = fs.readFileSync(sessionfile, {encoding:'utf8', flag:'r'});
    obj = JSON.parse(exsitingdata);
  } else {
    console.log("The file does not exist");
  }
  obj[key] = data;
  logger.debug("[fnSaveArg] save for:"+key+" value:"+obj[key]); 
  var jsonout = JSON.stringify(obj);

  fs.writeFileSync(sessionfile, jsonout);
  return (data)
}

exports.fnGetArg = function(sessionId,key,defaultValue) {
  var path = '/tmp/';
  var sessionfile = path + 'session_info.'+sessionId.toString();

  var fs = require('fs');
  var obj = {};

  if (fs.existsSync(sessionfile)) {
    exsitingdata = fs.readFileSync(sessionfile, {encoding:'utf8', flag:'r'});
    obj = JSON.parse(exsitingdata);
  } else {
    return (defaultValue);
  } 

  logger.debug("[cfnGetArg] return for:"+key+" value:"+(key in obj) ? obj[key] : defaultValue);  
  return ((key in obj) ? obj[key] : defaultValue)
}

// console.log(exports.fnSaveArg(21321,"arr4",[1,2,3,4]));
// console.log(exports.fnGetArg(21321,"arr1",[]));

// //console.log(exports.fnSaveArg(21321,"arr2",[1,2,3,4,5]));

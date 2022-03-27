const getNumInStr = (numPercent) =>
{ 
  numPercent = numPercent + "";
 return parseInt([...numPercent].filter(c => c >='0' || c<='9').join(''));
}

module.exports = {getNumInStr}

const getNumInStr = numPercent => {
  numPercent = numPercent + '';
  return parseInt([...numPercent].filter(c => c >= '0' && c <= '9').join(''));
};

const copyProps = (to, from) => {
  for (prop in from) to[prop] = from[prop];
};

module.exports = {getNumInStr, copyProps};

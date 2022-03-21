const findAndMarkFreeChild = (childArray) => {
  ret = childArray.find((child) => child.busy === false);

  if (ret === undefined) {
    ret = null;
  } else {
    console.log(`returning child: ${ret.id}`);
    ret.busy = true;
  }
  return ret;
};

module.exports = { findAndMarkFreeChild };

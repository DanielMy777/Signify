const findAndMarkFreeChild = async (childArray, mutex) => {
  const release = await mutex.acquire();

  ret = childArray.find((child) => child.busy === false);

  if (ret === undefined) {
    ret = null;
  } else {
    console.log(`returning child: ${ret.id}`);
    ret.busy = true;
  }

  release();
  return ret;
};

module.exports = { findAndMarkFreeChild };

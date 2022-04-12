import {Dimensions} from 'react-native';
import {getPercent} from './utils';
function addWindowSizeChangeListener(windowReSizeListener) {
  return Dimensions.addEventListener('change', () => {
    windowReSizeListener(getWindowDimensions());
  });
}
const getWindowDimensions = () => {
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  return {height, width};
};

module.exports = {
  addWindowSizeChangeListener,
  getWindowDimensions,
};

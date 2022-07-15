import Orientation from 'react-native-orientation-locker';
import {OrientationNames} from './OrentationNames';
import {getNumInStr, copyProps} from './utils';

create_hands_style = (
  handsRect,
  handsRectDefaultStyle,
  handsRectStyle,
  orientation,
) => {
  const rect_style = {...handsRectDefaultStyle, ...handsRectStyle};

  if (Orientation.isLocked()) {
    if (orientation == OrientationNames.LANDSCAPE_LEFT) {
      handsRect = {
        x: 100 - handsRect.y - handsRect.h,
        y: handsRect.x,
        w: handsRect.h,
        h: handsRect.w,
      };
    }

    if (orientation == OrientationNames.LANDSCAPE_RIGHT) {
      handsRect = {
        x: handsRect.y,
        y: 100 - handsRect.x - handsRect.w,
        w: handsRect.h,
        h: handsRect.w,
      };
    }
  }
  rect_style.top = handsRect.y + '%';
  rect_style.left = handsRect.x + '%';
  rect_style.width = handsRect.w + '%';
  rect_style.height = handsRect.h + '%';
  return rect_style;
};

module.exports = {create_hands_style};

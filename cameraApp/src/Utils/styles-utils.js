import {getNumInStr, copyProps} from './utils';

create_hands_style = (
  handsRect,
  handsRectDefaultStyle,
  handsRectStyle,
  orientation,
) => {
  const rect_style = {...handsRectDefaultStyle, ...handsRectStyle};
  rect_style.top = handsRect.y + '%';
  rect_style.left = handsRect.x + '%';
  rect_style.width = handsRect.w + '%';
  rect_style.height = handsRect.h + '%';
  return rect_style;
};

module.exports = {create_hands_style};

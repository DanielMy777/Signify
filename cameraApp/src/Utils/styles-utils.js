import {getNumInStr, copyProps} from './utils';

create_hands_style = (
  hand_rect,
  default_hands_style,
  camera_style,
  hands_rect_style,
) => {
  const hands_style = {...default_hands_style};
  copyProps(hands_style, hands_rect_style);
  const handRect = {...hand_rect};
  const left = getNumInStr(camera_style.left);
  const top = getNumInStr(camera_style.top);
  const c_width = getNumInStr(camera_style.width) / 100;
  const c_height = getNumInStr(camera_style.height) / 100;
  handRect.x = left + handRect.x * c_width;
  handRect.y = top + handRect.y * c_height;
  handRect.w = handRect.w * c_width;
  handRect.h = handRect.h * c_height;

  hands_style.width = handRect.w + '%';
  hands_style.height = handRect.h + '%';
  hands_style.left = handRect.x + '%';
  hands_style.top = handRect.y + '%';

  return hands_style;
};

module.exports = {create_hands_style};

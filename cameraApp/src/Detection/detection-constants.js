const UN_DETECTED_HANDS = {detected: false, v: 0, h: 0, w: 0, x: 0, y: 0};
const EMPTY_RESULTS = {
  hands: {handsRect: UN_DETECTED_HANDS},
  sign: {char: '!', detected: false},
};
const EMPTY_SIGN = '!';

class DetectionType {
  static HANDS = 'hands';
  static WORD = 'WORD';
  static LETTER = 'letter';
}

module.exports = {
  UN_DETECTED_HANDS,
  EMPTY_RESULTS,
  EMPTY_SIGN,
  DetectionType,
};

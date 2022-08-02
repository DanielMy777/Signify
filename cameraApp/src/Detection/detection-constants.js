const UN_DETECTED_HANDS = {
  detected: false,
  v: 0,
  h: 0,
  w: 0,
  x: 0,
  y: 0,
};
const EMPTY_HANDS = {
  hand1: UN_DETECTED_HANDS,
  hand2: UN_DETECTED_HANDS,
  v: 0,
};
const EMPTY_RESULTS = {
  hands: EMPTY_HANDS,
  sign: {char: '!', detected: false},
};
const EMPTY_SIGN = '!';

class DetectionType {
  static HANDS = 'hands';
  static HANDS2 = 'hands2';
  static WORD = 'WORD';
  static LETTER = 'letter';
}

module.exports = {
  UN_DETECTED_HANDS,
  EMPTY_RESULTS,
  EMPTY_SIGN,
  DetectionType,
  EMPTY_HANDS,
};

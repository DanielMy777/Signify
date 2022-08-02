import {HandsError} from '../Utils/custom-exceptions';
import {
  UN_DETECTED_HANDS,
  EMPTY_RESULTS,
  EMPTY_HANDS,
  DetectionType,
} from './detection-constants';
class SignifyDetectionAnalyzer {
  constructor(detection_model) {
    this.detection_model = detection_model;
    // this.stable_handRect = this.new_handRect = UN_DETECTED_HANDS;
    this.stable_hands = EMPTY_HANDS;
    this.ONEHAND = true;
    this.detectSignLanguageByDetectionType =
      this.detectSignLanguageByDetectionType.bind(this);
    this.detectHandsByDetectType = this.detectHandsByDetectType.bind(this);
  }

  detectHands(img) {
    return this.detect(this.detection_model.detectHands, img, this.ONEHAND);
  }

  detectTwoHands(img) {
    return this.detect(this.detection_model.detectTwoHands, img, !this.ONEHAND);
  }

  detectSignLanguageByDetectionType(img, detectType) {
    return detectType == DetectionType.LETTER
      ? this.detectSign(img)
      : this.detectWord(img);
  }

  detectHandsByDetectType(img, detectType) {
    return detectType == DetectionType.LETTER
      ? this.detectHands(img)
      : this.detectTwoHands(img);
  }

  detectByType(img, detectType) {
    switch (detectType) {
      case DetectionType.LETTER:
        return this.detectSign(img);
      case DetectionType.WORD:
        return this.detectWord(img);
      case DetectionType.HANDS:
        return this.detectHands(img);
      case DetectionType.HANDS2:
        return this.detectTwoHands(img);
    }
  }

  detectWord(img) {
    return this.detect(this.detection_model.detectWord, img, !this.ONEHAND);
  }

  fix_results(res, is_letter = true) {
    hands = res.hands.handsRect;
    hand1 = res.hands.handsRect;
    hand2 = UN_DETECTED_HANDS;
    num_hands = 1;
    if (!is_letter) {
      hand1 = {x: hands.x1, y: hands.y1, w: hands.w1, h: hands.h1};
      hand2 = {x: hands.x2, y: hands.y2, w: hands.w2, h: hands.h2};
    }

    return {
      sign: res.sign,
      hands: {hand1: hand1, hand2: hand2, msg: hands.msg, v: hands.v},
    };
  }

  async detect(detect_function, img, is_letter = true) {
    try {
      this.latest_res = this.fix_results(await detect_function(img), is_letter);
      this.update_hands(this.latest_res);
    } catch (e) {
      this.latest_res = EMPTY_RESULTS;
      this.latest_res.stable = true;
      this.stable_hands = EMPTY_HANDS;
      this.latest_res.error = e;
    }
    //console.log(this.latest_res);
    return this.latest_res;
  }

  async detectSign(img) {
    return this.detect(this.detection_model.detectSign, img, this.ONEHAND);
  }

  is_valid_hand(hand) {
    return hand.w != 0 && hand.h != 0;
  }

  update_hands(res) {
    hands = res.hands;
    hands.detected = hands.v == 1;
    //this.new_handRect = this.latest_res.hands.handsRect;
    //this.new_handRect.detected = this.new_handRect.v == 1;
    hands.hand1.detected = hands.v == 1;
    hands.hand2.detected = hands.v == 1 && this.is_valid_hand(hands.hand2);
    stable_hand1 = this.get_stable_handRect(
      this.stable_hands.hand1,
      hands.hand1,
    );
    stable_hand2 = this.get_stable_handRect(
      this.stable_hands.hand2,
      hands.hand2,
    );

    this.stable_hands = {hand1: stable_hand1, hand2: stable_hand2};
    if (!hands.detected) {
      this.latest_res.error = new HandsError(hands.msg);
    }
  }

  get_stable_handRect(stable_handRect, new_handRect) {
    const stable = this.is_new_stable(stable_handRect, new_handRect);
    new_handRect.stable = stable;
    return stable ? new_handRect : stable_handRect;
  }

  is_new_stable(stable_handRect, new_handRect) {
    let x_change = Math.abs(stable_handRect.x - new_handRect.x);
    let y_change = Math.abs(stable_handRect.y - new_handRect.y);
    let w_change = Math.abs(stable_handRect.w - new_handRect.w);
    let h_change = Math.abs(stable_handRect.h - new_handRect.h);
    return (
      x_change > 3 ||
      y_change > 3 ||
      w_change > 3 ||
      stable_handRect.detected ^ new_handRect.detected
    );
  }
}

module.exports = {
  SignifyDetectionAnalyzer: SignifyDetectionAnalyzer,
};

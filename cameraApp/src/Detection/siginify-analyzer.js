import {HandsError} from '../Utils/custom-exceptions';
import {UN_DETECTED_HANDS, EMPTY_RESULTS} from './detection-constants';
class SignifyDetectionAnalyzer {
  constructor(detection_model) {
    this.detection_model = detection_model;
    this.stable_handRect = this.new_handRect = UN_DETECTED_HANDS;
    this.sign_res = undefined;
  }

  detectHands(img) {
    return this.detect(this.detection_model.detectHands, img);
  }

  detectWord(img) {
    return this.detect(this.detection_model.detectWord, img);
  }

  async detect(detect_function, img) {
    try {
      this.latest_res = await detect_function(img);
      this.update_hands();
    } catch (e) {
      this.latest_res = EMPTY_RESULTS;
      this.latest_res.stable = true;
      this.stable_handRect = this.new_handRect = UN_DETECTED_HANDS;
      this.latest_res.error = e;
    }

    return this.latest_res;
  }

  async detectSign(img) {
    return this.detect(this.detection_model.detectSign, img);
  }

  get_stable_handsRect() {
    return this.stable_handRect;
  }

  get_newst_handsRect() {
    return this.new_handRect;
  }

  update_hands() {
    this.new_handRect = this.latest_res.hands.handsRect;
    this.new_handRect.detected = this.new_handRect.v == 1;
    this.stable_handRect = this.get_stable_handRect(this.new_handRect);
    if (!this.new_handRect.detected) {
      this.latest_res.error = new HandsError(this.new_handRect.msg);
    }
  }

  get_stable_handRect(new_handRect) {
    const stable = this.is_new_stable(new_handRect);
    new_handRect.stable = stable;
    return stable ? new_handRect : this.stable_handRect;
  }

  is_new_stable(new_handRect) {
    const stable_handRect = this.stable_handRect;
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

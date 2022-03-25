import { ip } from '../secrets'
import { HttpMethod, http_method } from './httpClient'
const UN_DETECTED_HANDS = { detected: false, v: 0, h: 0, w: 0, x: 0, y: 0 };
let prev_hand_detected = UN_DETECTED_HANDS;
let current_hand_detected = UN_DETECTED_HANDS;
const detect_hands = async (img) => {

    try {
        res = await http_method(`http://${ip}:2718/api/img`, HttpMethod.POST, { img: img }, 2000);
        prev_hand_detected = current_hand_detected;
        current_hand_detected = res;
        res.detected = res.v == 1;
        return res;
    } catch (e) {
        prev_hand_detected = current_hand_detected = UN_DETECTED_HANDS;
        throw e;
    }

};
//this method is to make the rectangle look stable and not reconstruct which looks wired
const is_handsRect_updated = () => {

    let x_change = Math.abs(prev_hand_detected.x - current_hand_detected.x);
    let y_change = Math.abs(prev_hand_detected.y - current_hand_detected.y);
    let w_change = Math.abs(prev_hand_detected.w - current_hand_detected.w);
    let h_change = Math.abs(prev_hand_detected.h - current_hand_detected.h);

    return x_change > 5 || y_change > 2 || (prev_hand_detected.detected ^ current_hand_detected.detected);

}



module.exports = {
    detect_hands: detect_hands,
    is_handsRect_updated: is_handsRect_updated,
    UN_DETECTED_HANDS: UN_DETECTED_HANDS
}
import { ip } from '../secrets'
import { HttpMethod, http_method } from './httpClient'
const UN_DETECTED_HANDS = { detected: false, v: 0, h: 0, w: 0, x: 0, y: 0 };
let stable_handRect = UN_DETECTED_HANDS;
let new_handRect = UN_DETECTED_HANDS;
const detect_hands = async (img) => {

    try {
        new_handRect = await http_method(`http://${ip}:2718/api/img`, HttpMethod.POST, { img: img }, 2000);
        new_handRect.detected = new_handRect.v == 1;
        check_update_stable_hands();
        
        return new_handRect
    } catch (e) {
        stable_handRect = new_handRect = UN_DETECTED_HANDS;
        throw e;
    }

};


const get_stable_handRect = () => {
    return stable_handRect;
}

const get_newst_handRect = () => {
    return new_handRect;
}

const check_update_stable_hands = () => {
    const updated = is_handsRect_updated();
    if (updated) {
        stable_handRect = new_handRect;
    }
    new_handRect.stable = updated;
}
const is_handsRect_updated = () => {

    let x_change = Math.abs(stable_handRect.x - new_handRect.x);
    let y_change = Math.abs(stable_handRect.y - new_handRect.y);
    let w_change = Math.abs(stable_handRect.w - new_handRect.w);
    let h_change = Math.abs(stable_handRect.h - new_handRect.h);
    return x_change > 6 || y_change > 3 || (stable_handRect.detected ^ new_handRect.detected);

}



module.exports = {
    detect_hands: detect_hands,
    UN_DETECTED_HANDS: UN_DETECTED_HANDS,
    get_newst_handRect: get_newst_handRect,
    get_stable_handRect: get_stable_handRect
}
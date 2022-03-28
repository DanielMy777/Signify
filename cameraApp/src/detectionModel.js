import { HttpMethod, http_method } from './httpClient'
import {UN_DETECTED_HANDS,EMPTY_RESULTS} from './DetectionConstants';
class SignifyWebDetectionModel
{
    constructor(ip,port)
    {
        this.ip = ip;
        this.port = port;
    }

    detect(img)
    {
       return http_method(`http://${this.ip}:${this.port}/api/img`,
       HttpMethod.POST, { img: img }, 2000);
    }
}




class SignifyDetectionAnalyzer
{
    constructor(detection_model)
    {
        this.detection_model = detection_model;
        this.stable_handRect = this.new_handRect = UN_DETECTED_HANDS;
        
    }

    async detectHandSign(img)
    {
        try
        {
        this.latest_res = await this.detection_model.detect(img);
        this.update_hands();
        return this.latest_res;
        }
        catch(e)
        {
            this.latest_res = EMPTY_RESULTS;
            this.stable_handRect = this.new_handRect = UN_DETECTED_HANDS;
            throw e;
        }
    }

    get_stable_handsRect()
    {
        return this.stable_handRect;
    }

    get_newst_handsRect()
    {
        return this.new_handRect;
    }


    update_hands()
    {
        this.new_handRect = this.latest_res.hands.handsRect;
        this.new_handRect.detected = this.new_handRect.v == 1;
        this.stable_handRect = this.get_stable_handRect(this.new_handRect);
    }

    get_stable_handRect(new_handRect)
    {
        const stable = this.is_new_stable(new_handRect);
        new_handRect.stable = stable;
        return stable ? new_handRect : this.stable_handRect;
    }

    is_new_stable(new_handRect)
    {
        const stable_handRect = this.stable_handRect;
        let x_change = Math.abs(stable_handRect.x - new_handRect.x);
        let y_change = Math.abs(stable_handRect.y - new_handRect.y);
        let w_change = Math.abs(stable_handRect.w - new_handRect.w);
        let h_change = Math.abs(stable_handRect.h - new_handRect.h);
        return  x_change > 6 || y_change > 3 || (stable_handRect.detected ^ new_handRect.detected);
    }

}



module.exports = {
    SignifyDetectionAnalyzer:SignifyDetectionAnalyzer,
    SignifyWebDetectionModel:SignifyWebDetectionModel
}
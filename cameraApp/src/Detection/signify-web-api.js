import {
  Exception,
  HttpMethod,
  http_method,
  NetworkException,
} from '../Network/httpClient';
class SignifyApiPath {
  static DETECT_HANDS = 'api/img/DetectHands';
  static DETECT_SIGN = 'api/img/DetectHandsSign';
}
class SignifyWebDetectionModel {
  constructor(ip, port, apiPath = SignifyApiPath) {
    this.ip = ip;
    this.port = port;
    this.apiPath = apiPath;
  }

  async sendRequest(path, img) {
    try {
      return await http_method(
        `http://${this.ip}:${this.port}/${path}`,
        HttpMethod.POST,
        {img: img},
        2000,
      );
    } catch (err) {
      throw new NetworkException('cant reach Server');
    }
  }

  detectSign(img) {
    return this.sendRequest(this.apiPath.DETECT_SIGN, img);
  }

  detectHands(img) {
    return this.sendRequest(this.apiPath.DETECT_HANDS, img);
  }
}

module.exports = {SignifyWebDetectionModel};

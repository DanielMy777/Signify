import {
  Exception,
  HttpMethod,
  http_method,
  NetworkException,
} from '../Network/httpClient';
class SignifyApiPath {
  static DETECT_HANDS = 'api/img/DetectHands';
  static DETECT_TWO_HANDS = 'api/img/Detect2Hands';
  static DETECT_SIGN = 'api/img/DetectHandsSign';
  static DETECT_WORD = 'api/img/DetectHandsWord';
}
class SignifyWebDetectionModel {
  constructor(ip, port, apiPath = SignifyApiPath) {
    this.ip = ip;
    this.port = port;
    this.apiPath = apiPath;
    this.detectSign = this.detectSign.bind(this);
    this.detectHands = this.detectHands.bind(this);
    this.detectWord = this.detectWord.bind(this);
    this.detectTwoHands = this.detectTwoHands.bind(this);
  }

  async sendRequest(path, img) {
    try {
      return await http_method(
        `http://${this.ip}:${this.port}/${path}`,
        HttpMethod.POST,
        {img: img},
        1200,
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

  detectTwoHands(img) {
    return this.sendRequest(this.apiPath.DETECT_TWO_HANDS, img);
  }

  detectWord(img) {
    return this.sendRequest(this.apiPath.DETECT_WORD, img);
  }
}

module.exports = {SignifyWebDetectionModel};

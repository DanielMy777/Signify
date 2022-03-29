import {Exception, HttpMethod, http_method} from '../Network/httpClient';
class SignifyWebDetectionModel {
  constructor(ip, port) {
    this.ip = ip;
    this.port = port;
  }

  async detect(img) {
    try {
      return await http_method(
        `http://${this.ip}:${this.port}/api/img`,
        HttpMethod.POST,
        {img: img},
        2000,
      );
    } catch (err) {
      throw new Exception('cant reach Server');
    }
  }
}

module.exports = {SignifyWebDetectionModel};

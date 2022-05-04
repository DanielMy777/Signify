import {SignifyDetectionAnalyzer} from './siginify-analyzer';
import {SignifyWebDetectionModel} from './signify-web-api';
import {ip, port} from '../../secrets';
let DEFAULT_MODEL = new SignifyDetectionAnalyzer(
  new SignifyWebDetectionModel(ip, port),
);
module.exports = {DEFAULT_MODEL: DEFAULT_MODEL};

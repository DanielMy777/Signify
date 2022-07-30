import {GoogleCloudTranslateApi} from './google-translate-text';
import {translate_key} from '../../secrets';
const google_translator = new GoogleCloudTranslateApi(translate_key);

module.exports = {google_translator};

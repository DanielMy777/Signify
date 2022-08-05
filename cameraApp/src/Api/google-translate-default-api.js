import {GoogleCloudTranslateApi} from './google-translate-text';
import {google_translate_api_key} from '../../secrets';
const google_translator = new GoogleCloudTranslateApi(google_translate_api_key);

module.exports = {google_translator};

import {Exception, http_method} from '../Network/httpClient';
class GoogleTranslateApiPath {
  constructor(key) {
    this.key = key;
  }
  create_path(text, target_lang) {
    return `https://translation.googleapis.com/language/translate/v2?key=${this.key}&target=${target_lang}&q=${text}`;
  }
}

class GoogleCloudTranslateApi {
  constructor(key) {
    this.path_builder = new GoogleTranslateApiPath(key);
  }

  async translate(text, language_translate_to) {
    try {
      translate_obj = await http_method(
        this.path_builder.create_path(text, language_translate_to),
      );
      if (!translate_obj.data || translate_obj.data.translations.length == 0) {
        return {error: new Exception('api didnt return right objet')};
      }
      const translate_data = translate_obj.data.translations[0];
      return {
        sourceLanguage: translate_data.detectedSourceLanguage,
        targetLanguage: language_translate_to,
        source: text,
        translated_text: translate_data.translatedText,
      };
    } catch (err) {
      return {error: err};
    }
  }
}

module.exports = {GoogleCloudTranslateApi};

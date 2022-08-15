en_sign_to_he_map = {
  A: 'א',
  B: 'ב',
  G: 'ג',
  DAL: 'ד',
  H: 'ה',
  D: 'ו',
  Z: 'ז',
  CH: 'ח',
  F: 'ט',
  I: 'י',
  C: 'כ',
  L: 'ל',
  M: 'מ',
  N: 'נ',
  TZ: 'צ',
  S: 'ס',
  V: 'ע',
  P: 'פ',
  K: 'ק',
  R: 'ר',
  W: 'ש',
  T: 'ת',
  ' ': ' ',
  SP: ' ',
};

en_word_he_map = {
  I: 'אני',
  'I LOVE YOU': 'אני אוהב אותך',
  YOU: 'אתה',
  WANT: 'רוצה',
  HAMBURGER: 'המבורגר',
  DO: 'האם',
  YES: 'כן',
  NO: 'לא',
  TO: 'ל',
  EAT: 'לאכול',
};
// problem with ח צ

class en_he_sign_convertor {
  static convert_sign(en_sign) {
    const sign = en_sign_to_he_map[en_sign.toUpperCase()];
    return sign ? sign : '!';
  }

  static convert_word(en_word) {
    const word = en_word_he_map[en_word.toUpperCase()];
    return word ? word : '!';
  }

  static convert(en_sign) {
    const is_word = en_sign.is_word;
    const text = en_sign.char;
    return !is_word ? this.convert_sign(text) : this.convert_word(text);
  }
}

module.exports = {
  en_he_sign_convertor,
};

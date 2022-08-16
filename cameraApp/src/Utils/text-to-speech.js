import Tts from 'react-native-tts';
import {is_heabrew_text} from './utils';
import {make_sound} from './sound';
const heabrew_word_sound_file_map = {
  א: 'aleph.mp3',
  ב: 'bet.mp3',
  ג: 'gimel.mp3',
  ד: 'daled.mp3',
  ה: 'h.mp3',
  ו: 'vav.mp3',
  ז: 'zayn.mp3',
  ח: 'het.mp3',
  ט: 'tet.mp3',
  י: 'yod.mp3',
  כ: 'caf.mp3',
  ל: 'lamed.mp3',
  מ: 'mem.mp3',
  נ: 'non.mp3',
  ס: 'sameh.mp3',
  ע: 'eyn.mp3',
  פ: 'p.mp3',
  צ: 'zadik.mp3',
  ק: 'kof.mp3',
  ר: 'reish.mp3',
  ש: 'shin.mp3',
  ת: 'taf.mp3',
  כן: 'yes.mp3',
  לא: 'no.mp3',
  'אני אוהב אותך': 'i_love_you.mp3',
  לאכול: 'eat.mp3',
  האם: 'doo.mp3',
  אתה: 'you.mp3',
  המבורגר: 'hamburger.mp3',
  אני: 'i.mp3',
  רוצה: 'want.mp3',
};

Tts.setDefaultLanguage('en-GB');
Tts.say = text => {
  Tts.stop();
  if (is_heabrew_text(text) && heabrew_word_sound_file_map[text]) {
    make_sound(heabrew_word_sound_file_map[text]);
  } else {
    Tts.speak(text);
  }
};

Tts.voices().then(voices => {
  //console.log(voices.map(x => x.language).filter(x => x.startsWith('HE')));
});

export default Tts;

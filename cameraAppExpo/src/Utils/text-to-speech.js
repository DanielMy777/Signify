import Tts from 'react-native-tts';
Tts.setDefaultLanguage('en-GB');
Tts.say = text => {
  Tts.stop();
  Tts.speak(text);
};
export default Tts;

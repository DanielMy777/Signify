import Sound from 'react-native-sound';
import {get_random_item_list} from './utils';
Sound.setCategory('Playback');
let last_sound = null;

let random_sounds = [];
for (let i = 1; i <= 5; i++) {
  random_sounds.push(`sound${i}.mp3`); //it will search the sound in android/app/src/main/res/raw folder
}

const make_sound = sound_path => {
  sound = new Sound(sound_path, Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to make sound');
      console.log(error);
    }
    if (last_sound) last_sound.stop();
    last_sound = sound;
    sound.setVolume(1);
    sound.play(succes => {
      if (!succes) {
        console.log('failed to make sound but loaded him');
      }
      sound.release();
    });
  });
};

const play_random_sound = () => {
  make_sound(get_random_item_list(random_sounds));
};

play_random_sound();

module.exports = {make_sound, play_random_sound};

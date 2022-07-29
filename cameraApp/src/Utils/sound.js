import Sound from 'react-native-sound';
import {get_random_item_list} from './utils';
Sound.setCategory('Playback');

const sound1 = require(`../../resources/music/sound1.mp3`);
const sound2 = require(`../../resources/music/sound2.mp3`);
const sound3 = require(`../../resources/music/sound3.mp3`);
const sound4 = require(`../../resources/music/sound4.mp3`);
const sound5 = require(`../../resources/music/sound5.mp3`);
const random_sounds = [sound1, sound2, sound3, sound4, sound5];

const make_sound = sound_file => {
  //sound_file is require('filepath')
  sound = new Sound(sound_file, error => {
    if (error) {
      console.log('failed to make sound');
      console.log(error);
    }
    sound.setVolume(1);
    sound.play(succes => {
      if (!succes) {
        console.log('failed to make sound but loaded him');
      }
    });
  });
  sound.release();
};

const play_random_sound = () => {
  make_sound(get_random_item_list(random_sounds));
};

module.exports = {make_sound, play_random_sound};

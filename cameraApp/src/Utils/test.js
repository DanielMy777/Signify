let Testify = 'test';
import {correct_sentence} from './correct-sentence';

const test = async sentence => {
  try {
    const results = await correct_sentence(sentence, true);
    console.log(results);
  } catch (e) {
    console.log('here dude');
    console.log(e.msg);
  }
};

//test('SEE YOUU');

export default Testify;

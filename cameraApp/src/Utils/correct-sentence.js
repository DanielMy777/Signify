import {AutoCorrect} from './auto-correct';

const auto_correct = new AutoCorrect();

const correct_sentence = async (sentence, print_matches_flag) => {
  let correct_text = sentence.toUpperCase();
  let fixes = await auto_correct.get_words_to_fix(sentence);
  if (print_matches_flag && fixes.length == 0)
    console.log('no fix matches found');
  console.log('matches are:');
  fixes.forEach(correct_obj => {
    if (print_matches_flag) console.log(correct_obj);
    correct_text = correct_text.replace(
      correct_obj.word.toUpperCase(),
      correct_obj.fixed_word.toUpperCase(),
    );
  });
  return correct_text;
};

export {correct_sentence};

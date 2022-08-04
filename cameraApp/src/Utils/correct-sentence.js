import {AutoCorrect} from './auto-correct';

const auto_correct = new AutoCorrect();

const correct_sentence = (sentence, number_of_matches, print_matches_flag) => {
  let correct_text = sentence;
  const words = sentence.split(' ');
  const last_word = words.length == 0 ? null : words[words.length - 1];
  if (
    last_word !== null &&
    last_word !== '' &&
    !auto_correct.is_word_correct(last_word)
  ) {
    const matches = auto_correct.get_best_matches(last_word, number_of_matches);
    if (print_matches_flag) {
      console.log(matches);
    }
    correct_text =
      words.slice(0, words.length - 1).join(' ') + ' ' + matches[0];
  }

  return correct_text;
};

export {correct_sentence};

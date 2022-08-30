import {AutoCorrect} from './auto-correct';

const auto_correct = new AutoCorrect();

const correct_sentence = async (
  sentence,
  number_of_matches,
  print_matches_flag,
) => {
  let correct_text = sentence;
  const words = sentence.split(' ');
  const last_word = words.length == 0 ? null : words[words.length - 1];
  if (
    last_word !== null &&
    last_word !== '' &&
    !auto_correct.is_word_correct(last_word)
  ) {
    const bestMatch = await auto_correct.get_best_match_by_api(last_word);
    //console.log(bestMatch);
    if (print_matches_flag) {
      console.log(`matches are : ${bestMatch}`);
    }
    correct_text = words.slice(0, words.length - 1).join(' ') + ' ' + bestMatch;
  }

  return correct_text;
};

export {correct_sentence};

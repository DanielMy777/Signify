import {dict} from '../../resources/dictionary/en_words.js';
import leven from 'leven';
import {PriorityQueue} from '../Utils/priority-queue.js';

class AutoCorrect {
  is_word_correct(word) {
    return dict.has(word);
  }

  correct_sentence(prev) {
    let correct_text = prev;
    const words = prev.split(' ');
    const last_word = words.length == 0 ? null : words[words.length - 1];
    if (
      last_word !== null &&
      last_word !== '' &&
      !this.is_word_correct(last_word)
    ) {
      const matches = this.get_best_matches(last_word, 3);
      console.log(matches);
      correct_text =
        words.slice(0, words.length - 1).join(' ') + ' ' + matches[0];
    }

    return correct_text;
  }

  get_best_matches(word, number_of_matches) {
    if (number_of_matches <= 0) {
      return [];
    }

    const min_queue = new PriorityQueue((a, b) => a[1] < b[1]);
    dict.forEach(w => {
      if (min_queue.size() < number_of_matches) {
        min_queue.push([w, -leven(w, word)]);
      } else {
        min_queue.push([w, -leven(w, word)]);
        min_queue.pop();
      }
    });

    const ret = [];
    while (min_queue.size() > 0) {
      ret.push(min_queue.pop()[0]);
    }

    return ret;
  }
}

export {AutoCorrect};

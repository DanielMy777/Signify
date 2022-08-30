import {dict} from '../../resources/dictionary/en_words.js';
import leven from 'leven';
import {PriorityQueue} from '../Utils/priority-queue.js';
import {
  Exception,
  HttpMethod,
  http_method,
  NetworkException,
} from '../Network/httpClient';
import {autocorrect_api_key} from '../../secrets.js';
const bingAutoCorrectApiUrl = 'https://api.bing.microsoft.com/v7.0/SpellCheck';

class AutoCorrect {
  is_word_correct(word) {
    return dict.has(word);
  }

  async get_best_match_by_api(word) {
    try {
      const matches = await http_method(
        `${bingAutoCorrectApiUrl}?mkt=en-US&mode=proof&text=${word.toLowerCase()}`,
        HttpMethod.POST,
        undefined,
        1000,
        {
          'Ocp-Apim-Subscription-Key': autocorrect_api_key,
        },
      );
      const matches_array = matches.flaggedTokens;

      if (matches_array.length == 0) {
        //  console.log('suggestion array is empty');
        return word; //no need to fix
      }
      return matches_array[0].suggestions[0].suggestion;
    } catch (e) {
      if (e.msg && e.msg.error) {
        if (e.msg.error.message.includes('invalid subscription key'))
          e.msg.error.message = 'invalid api key';
        throw new Exception(e.msg.error.message);
      }
      throw new NetworkException('couldnt reach api server');
    }
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

const autoc = new AutoCorrect();
const meow = async () => {
  try {
    // const response = await autoc.get_best_match_by_api('nname');
    // console.log(response);
  } catch (e) {
    console.log(e);
  }
};
meow();

export {AutoCorrect};

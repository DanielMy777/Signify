const getNumInStr = numPercent => {
  numPercent = numPercent + '';
  return parseInt([...numPercent].filter(c => c >= '0' && c <= '9').join(''));
};

const copyProps = (to, from) => {
  for (prop in from) to[prop] = from[prop];
};

const getPercent = (num, percent) => {
  return Math.round(num * (percent / 100));
};

const get_str_last_char = string => {
  if (string.length == 0) return '';
  return string[string.length - 1];
};

const count_char_sequence_from_str_end = (str, char) => {
  let count_char_seq_from_end = 0;
  for (let i = str.length - 1; i >= 0 && str[i] == char; i--) {
    count_char_seq_from_end++;
  }

  return count_char_seq_from_end;
};

module.exports = {
  getNumInStr,
  copyProps,
  getPercent,
  count_char_sequence_from_str_end,
  get_str_last_char,
};

const {Exception} = require('../Network/httpClient');

class HandsError extends Exception {
  constructor(msg) {
    super(msg);
  }
}
module.exports = {
  HandsError: HandsError,
};

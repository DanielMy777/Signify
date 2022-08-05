import {showMessage, hideMessage} from 'react-native-flash-message';

class MessageType {
  static WARNING = 'warning';
  static ERROR = 'danger';
  static INFO = 'info';
  static SUCCESS = 'success';
}

const show_message = (message, type = MessageType.WARNING, duration = 1850) => {
  showMessage({
    message,
    type,
    duration,
  });
};

const showWarning = msg => {
  show_message(msg, MessageType.WARNING);
};

const showError = msg => {
  show_message(msg, MessageType.ERROR);
};

export {showWarning, showError, show_message, MessageType, hideMessage};

import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidPostTypeException extends Error {
  constructor() {
    super(ExceptionsMessages.INVALID_POST_TYPE);
  }
}

export { InvalidPostTypeException };
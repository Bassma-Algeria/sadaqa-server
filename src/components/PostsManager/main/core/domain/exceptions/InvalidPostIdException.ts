import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidPostIdException extends Error {
  constructor() {
    super(ExceptionsMessages.INVALID_POST_ID);
  }
}

export { InvalidPostIdException };

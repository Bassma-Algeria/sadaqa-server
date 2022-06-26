import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidUserIdException extends Error {
  constructor() {
    super(ExceptionsMessages.INVALID_USER_ID);
  }
}

export { InvalidUserIdException };

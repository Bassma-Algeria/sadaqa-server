import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidUserIdException extends Error {
  constructor() {
    super(ExceptionsMessages.USER_ID_NOT_VALID);
  }
}

export { InvalidUserIdException };

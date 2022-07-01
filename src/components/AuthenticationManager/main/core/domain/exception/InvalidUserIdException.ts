import { ExceptionMessages } from './ExceptionMessages';

class InvalidUserIdException extends Error {
  constructor() {
    super(ExceptionMessages.INVALID_USERID);
  }
}

export { InvalidUserIdException };

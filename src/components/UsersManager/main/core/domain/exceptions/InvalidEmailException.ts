import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidEmailException extends Error {
  constructor() {
    super(ExceptionsMessages.INVALID_EMAIL);
  }
}

export { InvalidEmailException };

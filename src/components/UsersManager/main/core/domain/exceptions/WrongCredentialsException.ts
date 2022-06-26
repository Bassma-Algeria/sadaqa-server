import { ExceptionsMessages } from './ExceptionsMessages';

class WrongCredentialsException extends Error {
  constructor() {
    super(ExceptionsMessages.WRONG_CREDENTIALS);
  }
}

export { WrongCredentialsException };

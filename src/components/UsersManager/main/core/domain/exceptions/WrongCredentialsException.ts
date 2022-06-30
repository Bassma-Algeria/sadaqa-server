import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class WrongCredentialsException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.WRONG_CREDENTIALS);
  }
}

export { WrongCredentialsException };

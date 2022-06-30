import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class InvalidEmailException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.INVALID_EMAIL);
  }
}

export { InvalidEmailException };

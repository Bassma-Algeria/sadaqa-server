import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class InvalidPhoneNumberException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.INVALID_PHONE);
  }
}

export { InvalidPhoneNumberException };

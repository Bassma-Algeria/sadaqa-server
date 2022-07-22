import { MultiLanguagesException } from './MultiLanguagesException';
import { ExceptionsMessages } from './ExceptionsMessages';

class EmailAlreadyUsedException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.EMAIL_ALREADY_USED);
  }
}

export { EmailAlreadyUsedException };

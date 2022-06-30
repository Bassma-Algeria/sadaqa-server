import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from '../../../domain/exceptions/MultiLanguagesException';

class EmailAlreadyUsedException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.EMAIL_ALREADY_USED);
  }
}

export { EmailAlreadyUsedException };

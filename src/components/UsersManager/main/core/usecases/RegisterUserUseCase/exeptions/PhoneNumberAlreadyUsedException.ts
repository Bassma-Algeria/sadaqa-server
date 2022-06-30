import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from '../../../domain/exceptions/MultiLanguagesException';

class PhoneNumberAlreadyUsedException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.PHONE_NUMBER_ALREADY_USED);
  }
}

export { PhoneNumberAlreadyUsedException };

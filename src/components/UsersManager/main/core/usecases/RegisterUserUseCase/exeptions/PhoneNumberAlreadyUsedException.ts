import { ExceptionsMessages } from './ExceptionsMessages';

class PhoneNumberAlreadyUsedException extends Error {
  constructor() {
    super(ExceptionsMessages.PHONE_NUMBER_ALREADY_USED);
  }
}

export { PhoneNumberAlreadyUsedException };

import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidPhoneNumberException extends Error {
  constructor() {
    super(ExceptionsMessages.INVALID_PHONE);
  }
}

export { InvalidPhoneNumberException };

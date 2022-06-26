import { ExceptionsMessages } from './ExceptionsMessages';

class EmailAlreadyUsedException extends Error {
  constructor() {
    super(ExceptionsMessages.EMAIL_ALREADY_USED);
  }
}

export { EmailAlreadyUsedException };

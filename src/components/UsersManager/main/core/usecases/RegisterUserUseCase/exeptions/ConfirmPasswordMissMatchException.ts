import { ExceptionsMessages } from './ExceptionsMessages';

class ConfirmPasswordMissMatchException extends Error {
  constructor() {
    super(ExceptionsMessages.WRONG_CONFIRM_PASSWORD);
  }
}

export { ConfirmPasswordMissMatchException };

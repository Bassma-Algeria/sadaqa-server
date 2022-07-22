import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from '../../../domain/exceptions/MultiLanguagesException';

class ConfirmPasswordMissMatchException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.WRONG_CONFIRM_PASSWORD);
  }
}

export { ConfirmPasswordMissMatchException };

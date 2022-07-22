import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class InvalidWilayaNumberException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.INVALID_WILAYA_NUMBER);
  }
}

export { InvalidWilayaNumberException };

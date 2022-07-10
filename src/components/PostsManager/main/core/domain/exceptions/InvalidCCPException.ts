import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class InvalidCCPException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.INVALID_CCP);
  }
}

export { InvalidCCPException };

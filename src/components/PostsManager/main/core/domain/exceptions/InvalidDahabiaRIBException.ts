import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class InvalidDahabiaRIBException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.INVALID_RIB);
  }
}

export { InvalidDahabiaRIBException };

import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class ShortNameException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.SHORT_NAME);
  }
}

export { ShortNameException };

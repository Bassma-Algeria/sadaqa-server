import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class ShortPostTitleException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.SHORT_TITLE);
  }
}

export { ShortPostTitleException };

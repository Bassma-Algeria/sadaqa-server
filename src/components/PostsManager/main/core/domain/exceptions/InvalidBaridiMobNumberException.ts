import { MultiLanguagesException } from './MultiLanguagesException';
import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidBaridiMobNumberException extends MultiLanguagesException {
  constructor() {
    super(ExceptionsMessages.INVALID_BARIDI_MOB_NUMBER);
  }
}

export { InvalidBaridiMobNumberException };
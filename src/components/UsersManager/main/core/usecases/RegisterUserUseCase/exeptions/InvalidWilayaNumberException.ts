import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidWilayaNumberException extends Error {
  constructor() {
    super(ExceptionsMessages.INVALID_WILAYA_NUMBER);
  }
}

export { InvalidWilayaNumberException };

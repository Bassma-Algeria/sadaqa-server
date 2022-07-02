import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidWilayaNameException extends Error {
  constructor() {
    super(ExceptionsMessages.INVALID_WILAYA_NAME);
  }
}

export { InvalidWilayaNameException };

import { ExceptionsMessages } from './ExceptionsMessages';

class ShortNameException extends Error {
  constructor() {
    super(ExceptionsMessages.SHORT_NAME);
  }
}

export { ShortNameException };

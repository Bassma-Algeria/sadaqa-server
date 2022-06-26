import { ExceptionsMessages } from './ExceptionsMessages';

class ShortPasswordException extends Error {
  constructor() {
    super(ExceptionsMessages.SHORT_PASSWORD);
  }
}

export { ShortPasswordException };

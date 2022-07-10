import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidPictureUrlException extends Error {
  constructor() {
    super(ExceptionsMessages.INVALID_PICTURE_URL);
  }
}

export { InvalidPictureUrlException };

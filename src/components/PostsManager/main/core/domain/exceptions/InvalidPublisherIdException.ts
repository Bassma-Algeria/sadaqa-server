import { ExceptionsMessages } from './ExceptionsMessages';

class InvalidPublisherIdException extends Error {
  constructor() {
    super(ExceptionsMessages.PUBLISHER_ID_NOT_VALID);
  }
}

export { InvalidPublisherIdException };

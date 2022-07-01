import { ExceptionMessages } from './ExceptionMessages';

class InvalidAccessTokenException extends Error {
  constructor() {
    super(ExceptionMessages.INVALID_ACCESS_TOKEN);
  }
}

export { InvalidAccessTokenException };

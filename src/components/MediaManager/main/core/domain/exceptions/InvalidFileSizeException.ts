import { ExceptionMessages } from './ExceptionMessages';

class InvalidFileSizeException extends Error {
  constructor() {
    super(ExceptionMessages.INVALID_FILE_SIZE);
  }
}

export { InvalidFileSizeException };

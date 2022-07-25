import { ExceptionsMessages } from './ExceptionsMessages';

class UserNotExistException extends Error {
  constructor() {
    super(ExceptionsMessages.USER_NOT_EXIST);
  }
}

export { UserNotExistException };
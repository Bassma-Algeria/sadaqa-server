import { ExceptionsMessages } from './ExceptionsMessages';

class PostTypeNotSupportedException extends Error {
  constructor() {
    super(ExceptionsMessages.POST_TYPE_NOT_SUPPORTED);
  }
}

export { PostTypeNotSupportedException };

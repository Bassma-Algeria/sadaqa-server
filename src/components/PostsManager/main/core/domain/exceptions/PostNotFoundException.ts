import { ExceptionsMessages } from './ExceptionsMessages';

class PostNotFoundException extends Error {
  constructor() {
    super(ExceptionsMessages.POST_NOT_FOUND);
  }
}

export { PostNotFoundException };

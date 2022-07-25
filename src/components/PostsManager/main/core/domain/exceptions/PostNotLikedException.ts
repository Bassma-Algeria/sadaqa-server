import { ExceptionsMessages } from './ExceptionsMessages';

class PostNotLikedException extends Error {
  constructor() {
    super(ExceptionsMessages.POST_NOT_LIKED);
  }
}

export { PostNotLikedException };
import { ExceptionsMessages } from './ExceptionsMessages';

class PostAlreadyLikedException extends Error {
  constructor() {
    super(ExceptionsMessages.POST_ALREADY_LIKED);
  }
}

export { PostAlreadyLikedException };
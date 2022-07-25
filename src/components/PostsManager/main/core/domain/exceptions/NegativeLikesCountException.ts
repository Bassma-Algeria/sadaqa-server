import { ExceptionsMessages } from './ExceptionsMessages';

class NegativeLikesCountException extends Error {
  constructor() {
    super(ExceptionsMessages.NEGATIVE_LIKES_COUNT);
  }
}

export { NegativeLikesCountException };
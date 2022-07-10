import { ExceptionsMessages } from './ExceptionsMessages';

class NotAuthorizedToPublishThisPostTypeException extends Error {
  constructor() {
    super(ExceptionsMessages.NOT_AUTHORIZED_TO_PUBLISH_THIS_TYPE);
  }
}

export { NotAuthorizedToPublishThisPostTypeException };

import { ExceptionsMessages } from './ExceptionsMessages';

class NotAuthorizedToPublishThisPostException extends Error {
  constructor() {
    super(ExceptionsMessages.NOT_AUTHORIZED_TO_PUBLISH_THIS_TYPE);
  }
}

export { NotAuthorizedToPublishThisPostException };

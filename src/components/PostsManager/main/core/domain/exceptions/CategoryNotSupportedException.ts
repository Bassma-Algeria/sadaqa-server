import { ExceptionsMessages } from './ExceptionsMessages';

class CategoryNotSupportedException extends Error {
  constructor() {
    super(ExceptionsMessages.CATEGORY_NOT_SUPPORTED);
  }
}

export { CategoryNotSupportedException };

import { ExceptionMessages } from './ExceptionMessages';

class CannotUploadNonImageFilesException extends Error {
  constructor() {
    super(ExceptionMessages.CAN_NOT_UPLOAD_NON_IMAGES);
  }
}

export { CannotUploadNonImageFilesException };

import mimeType from 'mime-types';

import { ExceptionMessages } from './exceptions/ExceptionMessages';
import { ValidationException } from './exceptions/ValidationException';

class PictureToUpload {
    constructor(private readonly filename: string, private readonly buffer: Buffer) {
        if (!this.isPictureValid())
            throw new ValidationException(ExceptionMessages.NOT_A_SUPPORTED_PICTURE);
    }

    getBuffer() {
        return this.buffer.subarray();
    }

    getFilename() {
        return this.filename;
    }

    base64() {
        return this.buffer.toString('base64');
    }

    mimeType() {
        return mimeType.lookup(this.filename);
    }

    sizeInBytes() {
        return Buffer.byteLength(this.buffer);
    }

    private isPictureValid() {
        return this.mimeType().toString().includes('image/');
    }
}

export { PictureToUpload };

import { ExceptionsMessages } from './ExceptionsMessages';

class WilayaNotExistException extends Error {
    constructor() {
        super(ExceptionsMessages.WILAYA_NOT_EXIST);
    }
}

export { WilayaNotExistException };

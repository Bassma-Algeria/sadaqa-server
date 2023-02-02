import { RegionsException } from './RegionsException';
import { RegionsExceptionMessage } from './RegionsExceptionMessage';

class NotFoundException extends RegionsException {
    constructor(e: RegionsExceptionMessage) {
        super(e);
    }
}

export { NotFoundException };

import { ExceptionsMessages } from './ExceptionsMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class NoAssociationDocsProvidedException extends MultiLanguagesException {
    constructor() {
        super(ExceptionsMessages.NO_ASSOCIATION_DOCS);
    }
}

export { NoAssociationDocsProvidedException };

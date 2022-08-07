import { ExceptionMessages } from './ExceptionMessages';
import { MultiLanguagesException } from './MultiLanguagesException';

class NoAssociationDocsProvidedException extends MultiLanguagesException {
    constructor() {
        super(ExceptionMessages.NO_ASSOCIATION_DOCS);
    }
}

export { NoAssociationDocsProvidedException };

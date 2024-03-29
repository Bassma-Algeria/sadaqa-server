import { MultiLanguagesValidationException } from './exceptions/MultiLanguagesValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class AssociationDocs {
    private readonly _docs: { buffer: Buffer; filename: string }[];

    constructor(docs: { buffer: Buffer; filename: string }[]) {
        if (!docs.length)
            throw new MultiLanguagesValidationException(ExceptionMessages.NO_ASSOCIATION_DOCS);

        this._docs = docs;
    }

    docs() {
        return this._docs;
    }
}

export { AssociationDocs };

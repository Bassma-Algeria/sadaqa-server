import { NoAssociationDocsProvidedException } from './exceptions/NoAssociationDocsProvidedException';

class AssociationDocs {
    private readonly _docs: Buffer[];

    constructor(docs: Buffer[]) {
        if (!docs.length) throw new NoAssociationDocsProvidedException();

        this._docs = docs;
    }

    docs() {
        return this._docs;
    }
}

export { AssociationDocs };

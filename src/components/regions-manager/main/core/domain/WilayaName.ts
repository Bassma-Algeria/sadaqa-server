import { ValidationException } from './exceptions/ValidationException';
import { RegionsExceptionMessages } from './exceptions/RegionsExceptionMessages';

class WilayaName {
    private readonly name: string;

    constructor(name: string) {
        if (!name.trim()) throw new ValidationException(RegionsExceptionMessages.EMPTY_WILAYA_NAME);

        this.name = name.trim().toLowerCase().replace(/ /g, '-');
    }

    value() {
        return this.name;
    }
}

export { WilayaName };

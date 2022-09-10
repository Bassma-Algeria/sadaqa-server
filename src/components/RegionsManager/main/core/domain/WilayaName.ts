import { InvalidWilayaNameException } from './exceptions/InvalidWilayaNameException';

type Name = {
    en: string;
    ar: string;
};

class WilayaName {
    private readonly name: Name;

    constructor(name: Name) {
        if (!name.ar || !name.en) throw new InvalidWilayaNameException();

        this.name = name;
    }

    value() {
        return this.name;
    }
}

export { WilayaName };

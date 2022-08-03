import { InvalidWilayaNumberException } from './exceptions/InvalidWilayaNumberException';

class WilayaNumber {
    private readonly wilayaNumber: number;

    constructor(wilayaNumber: number) {
        if (wilayaNumber <= 0) throw new InvalidWilayaNumberException();

        this.wilayaNumber = wilayaNumber;
    }

    value() {
        return this.wilayaNumber;
    }
}

export { WilayaNumber };

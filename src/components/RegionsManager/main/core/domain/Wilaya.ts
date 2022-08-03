import { WilayaName } from './WilayaName';
import { WilayaNumber } from './WilayaNumber';

class Wilaya {
    constructor(readonly wilayaName: WilayaName, readonly wilayaNumber: WilayaNumber) {}
}

export { Wilaya };

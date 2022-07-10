import { InvalidDahabiaRIBException } from './exceptions/InvalidDahabiaRIBException';

class EdahabiaRIB {
  private readonly ONLY_NUMBERS_REGEX = /^\d+$/;

  private readonly rib: string;

  constructor(rib: string) {
    rib = rib?.trim();

    if (!rib.match(this.ONLY_NUMBERS_REGEX)) throw new InvalidDahabiaRIBException();

    this.rib = rib;
  }

  value() {
    return this.rib;
  }
}

export { EdahabiaRIB };

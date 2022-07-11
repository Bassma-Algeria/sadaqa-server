import { InvalidCCPException } from './exceptions/InvalidCCPException';

class CCP {
  private readonly ONLY_NUMBERS_REGEX = /^\d+$/;

  private readonly _ccpNumber: string;
  private readonly _ccpKey: string;

  constructor(ccpNumber: string, ccpKey: string) {
    ccpNumber = ccpNumber?.trim();
    ccpKey = ccpKey?.trim();

    if (!ccpNumber.match(this.ONLY_NUMBERS_REGEX) || !ccpKey.match(this.ONLY_NUMBERS_REGEX))
      throw new InvalidCCPException();

    this._ccpNumber = ccpNumber;
    this._ccpKey = ccpKey;
  }

  number() {
    return this._ccpNumber;
  }

  key() {
    return this._ccpKey;
  }
}

export { CCP };
import { InvalidCCPException } from './exceptions/InvalidCCPException';

class CCP {
  private readonly ONLY_NUMBERS_REGEX = /^\d+$/;

  private readonly _ccpNumber: string;
  private readonly _ccpKey: string;

  constructor(ccpNumber: string, ccpKey: string) {
    ccpNumber = ccpNumber?.trim();
    ccpKey = ccpKey?.trim();

    if (!this.isValidCCPNumber(ccpNumber) || !this.isValidCCPKey(ccpKey))
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

  private isValidCCPNumber(number: string) {
    return number && number.match(this.ONLY_NUMBERS_REGEX) && number.length === 10;
  }

  private isValidCCPKey(key: string) {
    return key && key.match(this.ONLY_NUMBERS_REGEX) && key.length === 2;
  }
}

export { CCP };

/* eslint-disable security/detect-unsafe-regex */

import { InvalidPictureUrlException } from './exceptions/InvalidPictureUrlException';

class Picture {
  private readonly URL_REGEX =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

  private readonly _url: string;

  constructor(url: string) {
    if (!url.match(this.URL_REGEX)) throw new InvalidPictureUrlException();

    this._url = url;
  }

  url() {
    return this._url;
  }
}

export { Picture };

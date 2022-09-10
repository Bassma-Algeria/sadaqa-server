import { ExceptionMessages } from './exceptions/ExceptionMessages';
import { ValidationException } from './exceptions/ValidationException';

class Picture {
    /* eslint-disable security/detect-unsafe-regex */
    private readonly URL_REGEX =
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

    private readonly _url: string;

    constructor(url: string) {
        if (!url.match(this.URL_REGEX))
            throw new ValidationException(ExceptionMessages.INVALID_PICTURE_URL);

        this._url = url;
    }

    url() {
        return this._url;
    }

    equals(picture: Picture) {
        return picture.url() === this._url;
    }
}

export { Picture };

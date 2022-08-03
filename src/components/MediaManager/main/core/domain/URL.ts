import { InvalidUrlException } from './exceptions/InvalidUrlException';

class URL {
    private readonly URL_REGEX =
        /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;

    private readonly url: string;

    constructor(url: string) {
        if (!url.match(this.URL_REGEX)) throw new InvalidUrlException();

        this.url = url;
    }

    value() {
        return this.url;
    }
}

export { URL };

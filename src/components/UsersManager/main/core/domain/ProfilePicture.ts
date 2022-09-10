import { ExceptionMessages } from './exceptions/ExceptionMessages';
import { ValidationException } from './exceptions/ValidationException';

class ProfilePicture {
    private readonly URL_REGEX =
        /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;

    private readonly _url: string;

    constructor(url: string) {
        if (!url.match(this.URL_REGEX))
            throw new ValidationException(ExceptionMessages.INVALID_PROFILE_PICTURE);

        this._url = url;
    }

    url() {
        return this._url;
    }

    equals(picture: ProfilePicture) {
        return this._url === picture.url();
    }
}

export { ProfilePicture };

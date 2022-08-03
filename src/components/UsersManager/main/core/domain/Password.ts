import { ShortPasswordException } from './exceptions/ShortPasswordException';

class Password {
    private readonly password: string;

    constructor(password: string) {
        password = password.trim();
        if (password.length < 6) throw new ShortPasswordException();

        this.password = password;
    }

    value() {
        return this.password;
    }

    equals(password: Password) {
        return password.value() === this.password;
    }
}

export { Password };

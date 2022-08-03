import { InvalidUserIdException } from './exception/InvalidUserIdException';

class UserId {
    private readonly id: string;

    constructor(id: string) {
        if (!id) throw new InvalidUserIdException();

        this.id = id;
    }

    value() {
        return this.id;
    }

    static from(id: string) {
        return new UserId(id);
    }
}

export { UserId };

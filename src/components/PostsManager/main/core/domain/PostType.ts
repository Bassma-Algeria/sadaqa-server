import { ValidationException } from './exceptions/ValidationException';
import { ExceptionMessages } from './exceptions/ExceptionMessages';

class PostType {
    static readonly POST_TYPES = [
        'donation',
        'donation-request',
        'family-in-need',
        'call-for-help',
    ] as const;

    private readonly postType: string;

    constructor(type: string) {
        if (!PostType.POST_TYPES.includes(type as any))
            throw new ValidationException(ExceptionMessages.INVALID_POST_TYPE);

        this.postType = type;
    }

    value() {
        return this.postType as typeof PostType.POST_TYPES[number];
    }

    equals(type: PostType) {
        return this.postType === type.value();
    }
}

export { PostType };

import { InvalidPostTypeException } from './exceptions/InvalidPostTypeException';

class PostType {
  static readonly POST_TYPES = [
    'donation',
    'donation-request',
    'family-in-need',
    'call-for-help',
  ] as const;

  private readonly postType: string;

  constructor(type: string) {
    if (!PostType.POST_TYPES.includes(type as any)) throw new InvalidPostTypeException();

    this.postType = type;
  }

  value() {
    return this.postType as typeof PostType.POST_TYPES[number];
  }
}

export { PostType };

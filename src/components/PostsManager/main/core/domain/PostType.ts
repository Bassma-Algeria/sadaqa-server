import { PostTypeNotSupportedException } from './exceptions/PostTypeNotSupportedException';

class PostType {
  public static readonly SUPPORTED_POST_TYPES = [
    'donation',
    'donation-request',
    'family-in-need',
    'call-for-help',
  ] as const;

  private readonly type: string;

  constructor(type: string) {
    if (!PostType.SUPPORTED_POST_TYPES.includes(type as any))
      throw new PostTypeNotSupportedException();

    this.type = type;
  }

  value() {
    return this.type as typeof PostType.SUPPORTED_POST_TYPES[number];
  }
}

export { PostType };

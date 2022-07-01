import { InvalidTokenException } from './exception/InvalidTokenException';

class Token {
  private readonly token: string;

  constructor(token: string) {
    if (!token) throw new InvalidTokenException();

    this.token = token;
  }

  value() {
    return this.token;
  }
}

export { Token };

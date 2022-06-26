import { InvalidUserIdException } from './exceptions/InvalidUserIdException';

class UserId {
  private readonly id: string;

  constructor(id: string) {
    if (!id) throw new InvalidUserIdException();

    this.id = id;
  }

  value() {
    return this.id;
  }
}

export { UserId };

import { InvalidPostIdException } from './exceptions/InvalidPostIdException';

class PostId {
  private readonly id: string;

  constructor(id: string) {
    if (!id) throw new InvalidPostIdException();

    this.id = id;
  }

  value() {
    return this.id;
  }
}

export { PostId };

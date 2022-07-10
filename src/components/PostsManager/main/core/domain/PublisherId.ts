import { InvalidPublisherIdException } from './exceptions/InvalidPublisherIdException';

class PublisherId {
  private readonly id: string;

  constructor(id: string) {
    if (!id) throw new InvalidPublisherIdException();

    this.id = id;
  }

  value() {
    return this.id;
  }
}

export { PublisherId };

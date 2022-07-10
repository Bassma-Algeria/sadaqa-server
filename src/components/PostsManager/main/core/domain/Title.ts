import { ShortPostTitleException } from './exceptions/ShortPostTitleException';

class Title {
  private readonly title: string;

  constructor(title: string) {
    title = title?.trim().toLowerCase();

    if (title?.length < 3) throw new ShortPostTitleException();

    this.title = title;
  }

  value() {
    return this.title;
  }
}

export { Title };

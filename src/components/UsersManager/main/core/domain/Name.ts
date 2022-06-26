import { ShortNameException } from './exceptions/ShortNameException';

class Name {
  private readonly name: string;

  constructor(name: string) {
    name = name.trim().toLowerCase();
    if (name.length < 3) throw new ShortNameException();

    this.name = name;
  }

  value() {
    return this.name;
  }
}

export { Name };

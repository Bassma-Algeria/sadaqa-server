class LocalPath {
  private readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  value() {
    return this.path;
  }
}

export { LocalPath };

class Description {
  private readonly description: string;

  constructor(desc: string) {
    this.description = desc?.trim().toLowerCase();
  }

  value() {
    return this.description;
  }
}

export { Description };

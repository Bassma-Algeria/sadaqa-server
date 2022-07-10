class DonationPostNotFoundException extends Error {
  constructor() {
    super('no donation post found');
  }
}

export { DonationPostNotFoundException };

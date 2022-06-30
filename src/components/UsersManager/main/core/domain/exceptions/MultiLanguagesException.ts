export interface ErrorMessage {
  en: string;
  ar: string;
}

class MultiLanguagesException extends Error {
  readonly errorMessage: ErrorMessage;

  constructor(error: ErrorMessage) {
    super(error.en);

    this.errorMessage = error;
  }
}

export { MultiLanguagesException };

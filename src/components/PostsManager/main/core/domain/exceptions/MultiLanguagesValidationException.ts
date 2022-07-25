import { ValidationException } from './ValidationException';

export type SupportedLanguages = 'en' | 'ar';

type ErrorMessage = {
  [key in SupportedLanguages]: string;
};

class MultiLanguagesValidationException extends ValidationException {
  readonly errorMessage: ErrorMessage;

  constructor(error: ErrorMessage) {
    super(error.en);

    this.errorMessage = error;
  }
}

export { MultiLanguagesValidationException };

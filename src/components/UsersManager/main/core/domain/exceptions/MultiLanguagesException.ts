export type SupportedLanguages = 'en' | 'ar';

type ErrorMessage = {
    [key in SupportedLanguages]: string;
};

class MultiLanguagesException extends Error {
    readonly errorMessage: ErrorMessage;

    constructor(error: ErrorMessage) {
        super(error.en);

        this.errorMessage = error;
    }
}

export { MultiLanguagesException };

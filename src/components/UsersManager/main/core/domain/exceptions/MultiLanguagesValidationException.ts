export type SupportedLanguages = 'ar' | 'en';

class MultiLanguagesValidationException extends Error {
    readonly error: Record<SupportedLanguages, string>;

    constructor(message: Record<SupportedLanguages, string>) {
        super(message.en);

        this.error = message;
    }
}

export { MultiLanguagesValidationException };
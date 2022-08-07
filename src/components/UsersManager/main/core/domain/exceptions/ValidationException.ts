class ValidationException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export { ValidationException };

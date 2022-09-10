class AuthorizationException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export { AuthorizationException };

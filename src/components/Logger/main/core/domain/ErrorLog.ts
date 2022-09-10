class ErrorLog {
    constructor(readonly message: string, readonly stack: any, readonly timestamp: Date) {}
}

export { ErrorLog };

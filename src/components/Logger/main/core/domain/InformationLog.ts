class InformationLog {
    constructor(
        readonly message: string,
        readonly payload: Record<string, any>,
        readonly timestamp: Date,
    ) {}
}

export { InformationLog };

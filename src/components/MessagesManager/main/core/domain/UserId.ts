class UserId {
    private readonly id;

    constructor(id: string) {
        this.id = id;
    }

    value() {
        return this.id;
    }

    equals(id: UserId) {
        return id.value() === this.id;
    }
}

export { UserId };
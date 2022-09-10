class PostTokens {
    private readonly tokens: string[];

    constructor(postTitle: string) {
        this.tokens = postTitle.split(' ');
    }

    *iterator() {
        for (const token of this.tokens) {
            yield token;
        }
    }
}

export { PostTokens };
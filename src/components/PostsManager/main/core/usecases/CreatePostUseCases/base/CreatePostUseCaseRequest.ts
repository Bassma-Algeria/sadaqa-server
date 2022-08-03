export interface CreatePostUseCaseRequest {
    readonly title: string;
    readonly description: string;
    readonly wilayaNumber: number;
    readonly publisherId: string;
    readonly pictures: Buffer[];
}

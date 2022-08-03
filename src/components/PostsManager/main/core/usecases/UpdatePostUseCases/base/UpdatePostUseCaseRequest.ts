export interface UpdatePostUseCaseRequest {
    readonly userId: string;
    readonly postId: string;
    readonly title: string;
    readonly description: string;
    readonly wilayaNumber: number;
    readonly pictures: { new: Buffer[]; old: string[] };
}

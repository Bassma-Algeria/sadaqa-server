export interface UpdatePostUseCaseRequest {
    readonly userId: string;
    readonly postId: string;
    readonly title: string;
    readonly description: string;
    readonly wilayaNumber: number;
    readonly pictures: { new: { buffer: Buffer; filename: string }[]; old: string[] };
}

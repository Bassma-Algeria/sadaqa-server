export interface PostDto {
    readonly postId: string;
    readonly title: string;
    readonly description: string;
    readonly wilayaNumber: number;
    readonly publisherId: string;
    readonly pictures: string[];
    readonly status: string;
    readonly createdAt: Date;
}

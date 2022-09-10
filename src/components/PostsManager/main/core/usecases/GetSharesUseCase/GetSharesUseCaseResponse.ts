export interface GetSharesUseCaseResponse {
    list: {
        userId: string | null;
        postId: string;
        postType: string;
        createdAt: Date;
    }[];
}

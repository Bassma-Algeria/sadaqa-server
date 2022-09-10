export interface CreateNewDonationPostNotificationUseCaseRequest {
    readonly postId: string;
    readonly title: string;
    readonly publisherId: string;
    readonly wilayaNumber: number;
}
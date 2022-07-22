export interface GetDonationRequestsPostsUseCaseResponse {
  readonly total: number;
  readonly page: number;
  readonly end: boolean;
  readonly donationRequests: {
    readonly postId: string;
    readonly title: string;
    readonly description: string;
    readonly wilayaNumber: number;
    readonly publisherId: string;
    readonly category: string;
    readonly pictures: string[];
    readonly createdAt: Date;
  }[];
}

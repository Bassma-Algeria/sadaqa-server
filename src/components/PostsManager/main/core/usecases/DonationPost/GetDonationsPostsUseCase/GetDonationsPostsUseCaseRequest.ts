export interface GetDonationsPostsUseCaseRequest {
  readonly category: string;
  readonly page?: number;
  readonly wilayaNumber?: number;
}
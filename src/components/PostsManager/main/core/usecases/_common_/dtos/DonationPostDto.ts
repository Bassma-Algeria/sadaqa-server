export interface DonationPostDto {
  readonly postId: string;
  readonly title: string;
  readonly description: string;
  readonly wilayaNumber: number;
  readonly publisherId: string;
  readonly category: string;
  readonly status: string;
  readonly pictures: string[];
  readonly createdAt: Date;
}
interface DonationCreatedPayload {
  postId: string;
  title: string;
  description: string;
  category: string;
  wilayaNumber: number;
  pictures: string[];
  publisherId: string;
  createdAt: Date;
}

export interface Events {
  NEW_DONATION_CREATED: DonationCreatedPayload;
}

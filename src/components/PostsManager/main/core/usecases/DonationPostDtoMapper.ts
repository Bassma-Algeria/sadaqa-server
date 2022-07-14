import { DonationPostDto } from './DonationPostDto';

import { DonationPost } from '../domain/DonationPost';

class DonationPostDtoMapper {
  static toDto(donationPost: DonationPost): DonationPostDto {
    return {
      title: donationPost.title.value(),
      postId: donationPost.postId.value(),
      category: donationPost.category.value(),
      description: donationPost.description.value(),
      publisherId: donationPost.publisherId.value(),
      wilayaNumber: donationPost.wilayaNumber.value(),
      pictures: donationPost.pictures.map(pic => pic.url()),
      createdAt: donationPost.createdAt,
    };
  }
}

export { DonationPostDtoMapper };

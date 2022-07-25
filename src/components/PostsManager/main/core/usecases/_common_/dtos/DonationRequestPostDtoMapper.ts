import { DonationRequestPostDto } from './DonationRequestPostDto';

import { DonationPost } from '../../../domain/DonationPost';

class DonationRequestPostDtoMapper {
  static toDto(post: DonationPost): DonationRequestPostDto {
    return {
      title: post.title.value(),
      postId: post.postId.value(),
      category: post.category.value(),
      description: post.description.value(),
      publisherId: post.publisherId.value(),
      wilayaNumber: post.wilayaNumber.value(),
      pictures: post.pictures.map(pic => pic.url()),
      createdAt: post.createdAt,
    };
  }
}

export { DonationRequestPostDtoMapper };

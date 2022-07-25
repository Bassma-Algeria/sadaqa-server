import { FamilyInNeedPostDto } from './FamilyInNeedPostDto';

import { FamilyInNeedPost } from '../../../domain/FamilyInNeedPost';

class FamilyInNeedPostDtoMapper {
  static toDto(post: FamilyInNeedPost): FamilyInNeedPostDto {
    return {
      postId: post.postId.value(),
      title: post.title.value(),
      description: post.description.value(),
      publisherId: post.publisherId.value(),
      wilayaNumber: post.wilayaNumber.value(),
      pictures: post.pictures.map(pic => pic.url()),
      ccp: post.ccp?.number(),
      ccpKey: post.ccp?.key(),
      baridiMobNumber: post.baridiMobNumber?.value(),
      createdAt: post.createdAt,
    };
  }
}

export { FamilyInNeedPostDtoMapper };
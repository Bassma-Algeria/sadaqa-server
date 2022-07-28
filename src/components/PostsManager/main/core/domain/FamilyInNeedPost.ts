import { CCP } from './CCP';
import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { BaridiMobNumber } from './BaridiMobNumber';

import { FamilyInNeedPostBuilder } from './FamilyInNeedPostBuilder';

class FamilyInNeedPost {
  static aBuilder() {
    return new FamilyInNeedPostBuilder();
  }

  static aBuilderFrom(post: FamilyInNeedPost) {
    return new FamilyInNeedPostBuilder(post);
  }

  constructor(
    readonly postId: PostId,
    readonly title: Title,
    readonly description: Description,
    readonly wilayaNumber: WilayaNumber,
    readonly publisherId: UserId,
    readonly pictures: Picture[],
    readonly createdAt: Date,
    readonly status: PostStatus,
    readonly ccp?: CCP,
    readonly baridiMobNumber?: BaridiMobNumber,
  ) {}

  toggleEnableStatus() {
    return FamilyInNeedPost.aBuilderFrom(this)
      .withStatus(this.status === 'ENABLED' ? PostStatus.DISABLED : PostStatus.ENABLED)
      .build();
  }
}

export { FamilyInNeedPost };
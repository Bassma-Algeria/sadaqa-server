import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { DonationCategory } from './DonationCategory';

import { DonationRequestPostBuilder } from './DonationRequestPostBuilder';

class DonationRequestPost {
  static aBuilder() {
    return new DonationRequestPostBuilder();
  }

  static aBuilderFrom(post: DonationRequestPost) {
    return new DonationRequestPostBuilder(post);
  }

  constructor(
    readonly postId: PostId,
    readonly title: Title,
    readonly description: Description,
    readonly category: DonationCategory,
    readonly wilayaNumber: WilayaNumber,
    readonly pictures: Picture[],
    readonly status: PostStatus,
    readonly publisherId: UserId,
    readonly createdAt: Date,
  ) {}

  toggleEnableStatus() {
    return DonationRequestPost.aBuilderFrom(this)
      .withStatus(this.status === 'ENABLED' ? PostStatus.DISABLED : PostStatus.ENABLED)
      .build();
  }
}

export { DonationRequestPost };

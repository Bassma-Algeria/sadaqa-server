import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { DonationCategory } from './DonationCategory';
import { DonationPostBuilder } from './DonationPostBuilder';

class DonationPost {
  static aBuilder() {
    return new DonationPostBuilder();
  }

  static aBuilderFrom(post: DonationPost) {
    return new DonationPostBuilder(post);
  }

  constructor(
    readonly postId: PostId,
    readonly title: Title,
    readonly description: Description,
    readonly category: DonationCategory,
    readonly wilayaNumber: WilayaNumber,
    readonly pictures: Picture[],
    readonly publisherId: UserId,
    readonly status: PostStatus,
    readonly createdAt: Date,
  ) {}

  toggleEnableStatus() {
    return DonationPost.aBuilderFrom(this)
      .withStatus(this.status === 'ENABLED' ? PostStatus.DISABLED : PostStatus.ENABLED)
      .build();
  }
}

export { DonationPost };

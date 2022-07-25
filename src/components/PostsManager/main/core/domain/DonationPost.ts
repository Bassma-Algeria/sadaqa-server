import { Title } from './Title';
import { PostId } from './PostId';
import { Picture } from './Picture';
import { Description } from './Description';
import { UserId } from './UserId';
import { WilayaNumber } from './WilayaNumber';
import { DonationCategory } from './DonationCategory';
import { DonationPostBuilder } from './DonationPostBuilder';

class DonationPost {
  constructor(
    readonly postId: PostId,
    readonly title: Title,
    readonly description: Description,
    readonly category: DonationCategory,
    readonly wilayaNumber: WilayaNumber,
    readonly pictures: Picture[],
    readonly publisherId: UserId,
    readonly createdAt: Date,
  ) {}

  static aBuilder() {
    return new DonationPostBuilder();
  }

  static aBuilderFrom(post: DonationPost) {
    return new DonationPostBuilder(post);
  }
}

export { DonationPost };

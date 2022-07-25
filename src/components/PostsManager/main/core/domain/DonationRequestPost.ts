import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { DonationCategory } from './DonationCategory';

import { DonationRequestPostBuilder } from './DonationRequestPostBuilder';

class DonationRequestPost {
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
    return new DonationRequestPostBuilder();
  }

  static aBuilderFrom(post: DonationRequestPost) {
    return new DonationRequestPostBuilder(post);
  }
}

export { DonationRequestPost };

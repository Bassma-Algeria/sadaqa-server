import { Title } from './Title';
import { PostId } from './PostId';
import { Picture } from './Picture';
import { Description } from './Description';
import { PublisherId } from './PublisherId';
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
    readonly publisherId: PublisherId,
    readonly createdAt: Date,
  ) {}

  static aBuilder() {
    return new DonationPostBuilder();
  }
}

export { DonationPost };

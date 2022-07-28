import { CCP } from './CCP';
import { Title } from './Title';
import { PostId } from './PostId';
import { Picture } from './Picture';
import { UserId } from './UserId';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { BaridiMobNumber } from './BaridiMobNumber';

import { CallForHelpPostBuilder } from './CallForHelpPostBuilder';

class CallForHelpPost {
  static aBuilder() {
    return new CallForHelpPostBuilder();
  }

  static aBuilderFrom(post: CallForHelpPost) {
    return new CallForHelpPostBuilder(post);
  }

  constructor(
    readonly postId: PostId,
    readonly title: Title,
    readonly description: Description,
    readonly wilayaNumber: WilayaNumber,
    readonly publisherId: UserId,
    readonly pictures: Picture[],
    readonly status: PostStatus,
    readonly createdAt: Date,
    readonly ccp?: CCP,
    readonly baridiMobNumber?: BaridiMobNumber,
  ) {
  }


  toggleEnableStatus() {
    return CallForHelpPost.aBuilderFrom(this)
      .withStatus(this.status === 'ENABLED' ? PostStatus.DISABLED : PostStatus.ENABLED)
      .build();
  }
}

export { CallForHelpPost };
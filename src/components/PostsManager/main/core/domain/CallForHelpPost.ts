import { CCP } from './CCP';
import { Title } from './Title';
import { PostId } from './PostId';
import { Picture } from './Picture';
import { Description } from './Description';
import { UserId } from './UserId';
import { WilayaNumber } from './WilayaNumber';
import { BaridiMobNumber } from './BaridiMobNumber';

import { CallForHelpPostBuilder } from './CallForHelpPostBuilder';

class CallForHelpPost {
  constructor(
    readonly postId: PostId,
    readonly title: Title,
    readonly description: Description,
    readonly wilayaNumber: WilayaNumber,
    readonly publisherId: UserId,
    readonly pictures: Picture[],
    readonly createdAt: Date,
    readonly ccp?: CCP,
    readonly baridiMobNumber?: BaridiMobNumber,
  ) {}

  static aBuilder() {
    return new CallForHelpPostBuilder();
  }

  static aBuilderFrom(post: CallForHelpPost) {
    return new CallForHelpPostBuilder(post);
  }
}

export { CallForHelpPost };
import { CCP } from './CCP';
import { Title } from './Title';
import { PostId } from './PostId';
import { Picture } from './Picture';
import { Description } from './Description';
import { PublisherId } from './PublisherId';
import { WilayaNumber } from './WilayaNumber';
import { BaridiMobNumber } from './BaridiMobNumber';

import { FamilyInNeedPostBuilder } from './FamilyInNeedPostBuilder';

class FamilyInNeedPost {
  constructor(
    readonly postId: PostId,
    readonly title: Title,
    readonly description: Description,
    readonly wilayaNumber: WilayaNumber,
    readonly publisherId: PublisherId,
    readonly pictures: Picture[],
    readonly createdAt: Date,
    readonly ccp?: CCP,
    readonly baridiMobNumber?: BaridiMobNumber,
  ) {}

  static aBuilder() {
    return new FamilyInNeedPostBuilder();
  }
}

export { FamilyInNeedPost };
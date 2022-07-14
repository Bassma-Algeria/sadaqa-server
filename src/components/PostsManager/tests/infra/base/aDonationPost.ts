import { faker } from '@faker-js/faker';

import { Title } from '../../../main/core/domain/Title';
import { PostId } from '../../../main/core/domain/PostId';
import { Picture } from '../../../main/core/domain/Picture';
import { Description } from '../../../main/core/domain/Description';
import { PublisherId } from '../../../main/core/domain/PublisherId';
import { WilayaNumber } from '../../../main/core/domain/WilayaNumber';
import { DonationCategory } from '../../../main/core/domain/DonationCategory';

import { DonationPost } from '../../../main/core/domain/DonationPost';

interface BaseDonationPose {
  category?: DonationCategory;
  wilayaNumber?: WilayaNumber;
}

const aDonationPost = (base?: BaseDonationPose): DonationPost => {
  const RANDOM_CATEGORY_INDEX = faker.datatype.number({
    min: 0,
    max: DonationCategory.SUPPORTED_CATEGORIES.length - 1,
  });

  const RANDOM_WILAYA = new WilayaNumber(faker.datatype.number({ min: 1, max: 30 }));
  const RANDOM_CATEGORY = new DonationCategory(
    DonationCategory.SUPPORTED_CATEGORIES[RANDOM_CATEGORY_INDEX],
  );

  return DonationPost.aBuilder()
    .withPostId(new PostId(faker.datatype.uuid()))
    .withTitle(new Title(faker.lorem.words(3)))
    .withDescription(new Description(faker.lorem.words(10)))
    .withCategory(base?.category || RANDOM_CATEGORY)
    .withWilayaNumber(base?.wilayaNumber || RANDOM_WILAYA)
    .withPictures([new Picture(faker.image.imageUrl())])
    .withPublisherId(new PublisherId(faker.datatype.uuid()))
    .withCreatedAt(faker.date.recent())
    .build();
};

export { aDonationPost };

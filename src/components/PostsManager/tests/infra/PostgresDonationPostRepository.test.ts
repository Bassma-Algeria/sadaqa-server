import { expect } from 'chai';

import { faker } from '@faker-js/faker';

import { Title } from '../../main/core/domain/Title';
import { PostId } from '../../main/core/domain/PostId';
import { Picture } from '../../main/core/domain/Picture';
import { PublisherId } from '../../main/core/domain/PublisherId';
import { Description } from '../../main/core/domain/Description';
import { WilayaNumber } from '../../main/core/domain/WilayaNumber';
import { DonationPost } from '../../main/core/domain/DonationPost';

import { DonationCategory } from '../../main/core/domain/DonationCategory';

import { PostgresDonationPostRepository } from '../../main/infra/real/PostgresDonationPostRepository';

describe('PostgresDonationPostRepository', () => {
  const donationPostRepository = new PostgresDonationPostRepository();

  it('should save a post and get it by id', async () => {
    const donationPost = aDonationPost();

    await donationPostRepository.save(donationPost);
    const savedPost = await donationPostRepository.findById(donationPost.postId);

    expect(savedPost?.title.value()).to.equal(donationPost.title.value());
    expect(savedPost?.description.value()).to.equal(donationPost.description.value());
    expect(savedPost?.publisherId.value()).to.equal(donationPost.publisherId.value());
    expect(savedPost?.wilayaNumber.value()).to.equal(donationPost.wilayaNumber.value());
    expect(savedPost?.createdAt.toISOString()).to.equal(donationPost.createdAt.toISOString());
  });

  it('should return undefined when no post found with the provided id', async () => {
    const NOT_EXISTING_ID = new PostId('some random id');

    await expect(donationPostRepository.findById(NOT_EXISTING_ID)).to.eventually.equal(undefined);
  });

  const aDonationPost = () => {
    return DonationPost.aBuilder()
      .withPostId(new PostId(faker.datatype.uuid()))
      .withTitle(new Title(faker.lorem.words(3)))
      .withDescription(new Description(faker.lorem.words(10)))
      .withCategory(new DonationCategory('food'))
      .withWilayaNumber(new WilayaNumber(faker.datatype.number({ min: 1, max: 30 })))
      .withPictures([new Picture(faker.image.imageUrl())])
      .withPublisherId(new PublisherId(faker.datatype.uuid()))
      .withCreatedAt(faker.date.recent())
      .build();
  };
});

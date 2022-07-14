import { expect } from 'chai';

import { PostId } from '../../main/core/domain/PostId';

import { aDonationPost } from './base/aDonationPost';

import { WilayaNumber } from '../../main/core/domain/WilayaNumber';
import { DonationCategory } from '../../main/core/domain/DonationCategory';

import { PostgresDonationPostRepository } from '../../main/infra/real/PostgresDonationPostRepository';
import { DonationPost } from '../../main/core/domain/DonationPost';

describe('PostgresDonationPostRepository', () => {
  const donationPostRepository = new PostgresDonationPostRepository();

  beforeEach(async () => {
    await donationPostRepository.deleteAll();
  });

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

  it('should get the posts page per page, filtered by category and wilaya number', async () => {
    const { wilayaNumber, category } = await save5PostsOfSameWilayaAndCategory();
    await save5RandomPostsNotHave(wilayaNumber, category);

    const donationsPosts = await donationPostRepository.findMany({
      pageLimit: 2,
      page: 3,
      wilayaNumber,
      category,
    });

    expect(donationsPosts).to.have.lengthOf(1);
    expect(donationsPosts[0].category.value()).to.equal(category.value());
    expect(donationsPosts[0].wilayaNumber.value()).to.equal(wilayaNumber.value());
  });

  async function save5PostsOfSameWilayaAndCategory() {
    const wilayaNumber = new WilayaNumber(10);
    const category = new DonationCategory('food');

    for (const _ of Array.from({ length: 5 })) {
      await donationPostRepository.save(aDonationPost({ wilayaNumber, category }));
    }

    return { wilayaNumber, category };
  }

  async function save5RandomPostsNotHave(wilayaNumber: WilayaNumber, category: DonationCategory) {
    let counter = 0;
    const donationPosts: DonationPost[] = [];

    do {
      const post = aDonationPost();

      if (
        post.category.value() !== category.value() &&
        post.wilayaNumber.value() !== wilayaNumber.value()
      ) {
        donationPosts.push(post);
        counter++;
      }
    } while (counter !== 5);

    for (const donationPost of donationPosts) {
      await donationPostRepository.save(donationPost);
    }
  }
});

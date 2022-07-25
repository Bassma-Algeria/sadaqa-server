import { Title } from './Title';
import { PostId } from './PostId';
import { Picture } from './Picture';
import { Description } from './Description';
import { UserId } from './UserId';
import { WilayaNumber } from './WilayaNumber';
import { DonationPost } from './DonationPost';
import { DonationCategory } from './DonationCategory';

class DonationPostBuilder {
  private postId!: PostId;
  private title!: Title;
  private description!: Description;
  private category!: DonationCategory;
  private wilayaNumber!: WilayaNumber;
  private pictures!: Picture[];
  private publisherId!: UserId;
  private createdAt!: Date;

  constructor(post?: DonationPost) {
    if (!post) return;

    this.postId = post.postId;
    this.title = post.title;
    this.description = post.description;
    this.wilayaNumber = post.wilayaNumber;
    this.category = post.category;
    this.publisherId = post.publisherId;
    this.pictures = post.pictures;
    this.createdAt = post.createdAt;
  }

  withPostId(id: PostId) {
    this.postId = id;
    return this;
  }

  withTitle(title: Title) {
    this.title = title;
    return this;
  }

  withDescription(description: Description) {
    this.description = description;
    return this;
  }

  withCategory(category: DonationCategory) {
    this.category = category;
    return this;
  }

  withWilayaNumber(wilayaNumber: WilayaNumber) {
    this.wilayaNumber = wilayaNumber;
    return this;
  }

  withPictures(pictures: Picture[]) {
    this.pictures = pictures;
    return this;
  }

  withPublisherId(publisherId: UserId) {
    this.publisherId = publisherId;
    return this;
  }

  withCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
    return this;
  }

  build() {
    return new DonationPost(
      this.postId,
      this.title,
      this.description,
      this.category,
      this.wilayaNumber,
      this.pictures,
      this.publisherId,
      this.createdAt,
    );
  }
}

export { DonationPostBuilder };

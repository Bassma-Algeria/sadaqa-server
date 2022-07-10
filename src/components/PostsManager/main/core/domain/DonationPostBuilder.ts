import { Description } from './Description';
import { DonationCategory } from './DonationCategory';
import { DonationPost } from './DonationPost';
import { Picture } from './Picture';
import { PostId } from './PostId';
import { PublisherId } from './PublisherId';
import { Title } from './Title';
import { WilayaNumber } from './WilayaNumber';

class DonationPostBuilder {
  private postId!: PostId;
  private title!: Title;
  private description!: Description;
  private category!: DonationCategory;
  private wilayaNumber!: WilayaNumber;
  private pictures!: Picture[];
  private publisherId!: PublisherId;
  private createdAt!: Date;

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

  withPublisherId(publisherId: PublisherId) {
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

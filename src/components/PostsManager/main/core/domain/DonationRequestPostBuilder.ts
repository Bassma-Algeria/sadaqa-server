import { Title } from './Title';
import { PostId } from './PostId';
import { Picture } from './Picture';
import { PublisherId } from './PublisherId';
import { Description } from './Description';
import { DonationPost } from './DonationPost';
import { WilayaNumber } from './WilayaNumber';
import { DonationCategory } from './DonationCategory';

class DonationRequestPostBuilder {
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

export { DonationRequestPostBuilder };

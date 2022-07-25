import { CCP } from './CCP';
import { Title } from './Title';
import { PostId } from './PostId';
import { Picture } from './Picture';
import { Description } from './Description';
import { UserId } from './UserId';
import { WilayaNumber } from './WilayaNumber';
import { BaridiMobNumber } from './BaridiMobNumber';

import { CallForHelpPost } from './CallForHelpPost';

class CallForHelpPostBuilder {
  private _postId!: PostId;
  private _title!: Title;
  private _description!: Description;
  private _wilayaNumber!: WilayaNumber;
  private _publisherId!: UserId;
  private _pictures!: Picture[];
  private _createdAt!: Date;
  private _ccp: CCP | undefined;
  private _baridiMobNumber: BaridiMobNumber | undefined;

  constructor(post?: CallForHelpPost) {
    if (!post) return;

    this._postId = post.postId;
    this._title = post.title;
    this._description = post.description;
    this._wilayaNumber = post.wilayaNumber;
    this._publisherId = post.publisherId;
    this._pictures = post.pictures;
    this._createdAt = post.createdAt;
    this._ccp = post.ccp;
    this._baridiMobNumber = post.baridiMobNumber;
  }

  withPostId(postId: PostId) {
    this._postId = postId;
    return this;
  }

  withTitle(title: Title) {
    this._title = title;
    return this;
  }

  withDescription(description: Description) {
    this._description = description;
    return this;
  }

  withWilayaNumber(wilayaNumber: WilayaNumber) {
    this._wilayaNumber = wilayaNumber;
    return this;
  }

  withPublisherId(publisherId: UserId) {
    this._publisherId = publisherId;
    return this;
  }

  withPictures(pictures: Picture[]) {
    this._pictures = pictures;
    return this;
  }

  withCreatedAt(creationTime: Date) {
    this._createdAt = creationTime;
    return this;
  }

  withCCP(ccp: CCP | undefined) {
    this._ccp = ccp;
    return this;
  }

  withBaridiMobNumber(baridiMobNumber: BaridiMobNumber | undefined) {
    this._baridiMobNumber = baridiMobNumber;
    return this;
  }

  build() {
    return new CallForHelpPost(
      this._postId,
      this._title,
      this._description,
      this._wilayaNumber,
      this._publisherId,
      this._pictures,
      this._createdAt,
      this._ccp,
      this._baridiMobNumber,
    );
  }
}

export { CallForHelpPostBuilder };

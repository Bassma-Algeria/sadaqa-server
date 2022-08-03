import { Post } from './Post';

import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';

abstract class PostBuilder {
    abstract build(): Post;

    protected postId!: PostId;
    protected title!: Title;
    protected description!: Description;
    protected wilayaNumber!: WilayaNumber;
    protected pictures!: Picture[];
    protected publisherId!: UserId;
    protected status!: PostStatus;
    protected createdAt!: Date;

    protected constructor(post?: Post) {
        if (!post) return;

        this.postId = post.postId;
        this.title = post.title;
        this.description = post.description;
        this.wilayaNumber = post.wilayaNumber;
        this.publisherId = post.publisherId;
        this.status = post.status;
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

    withStatus(status: PostStatus) {
        this.status = status;
        return this;
    }

    withCreatedAt(createdAt: Date) {
        this.createdAt = createdAt;
        return this;
    }
}

export { PostBuilder };

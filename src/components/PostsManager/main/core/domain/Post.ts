import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { PostType } from './PostType';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';
import { PostPictures } from './PostPictures';

import { PostBuilder } from './PostBuilder';

abstract class Post {
    protected abstract aBuilderFromThis(): PostBuilder;

    protected abstract postType: PostType;

    protected constructor(
        protected postId: PostId,
        protected title: Title,
        protected description: Description,
        protected wilayaNumber: WilayaNumber,
        protected publisherId: UserId,
        protected pictures: PostPictures,
        protected status: PostStatus,
        protected createdAt: Date,
    ) {}

    getPostId() {
        return this.postId;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getWilayaNumber() {
        return this.wilayaNumber;
    }

    getPublisherId() {
        return this.publisherId;
    }

    getPictures() {
        return this.pictures;
    }

    getStatus() {
        return this.status;
    }

    getPostType() {
        return this.postType;
    }

    getCreationTime() {
        return this.createdAt;
    }

    get state() {
        return {
            postId: this.postId.value(),
            title: this.title.value(),
            description: this.description.value(),
            wilayaNumber: this.wilayaNumber.value(),
            publisherId: this.publisherId.value(),
            pictures: this.pictures.state,
            status: this.status.toString(),
            type: this.postType.value() as string,
            createdAt: this.createdAt,
        } as const;
    }

    toggleEnablingStatus() {
        return this.aBuilderFromThis()
            .withStatus(this.status === 'ENABLED' ? PostStatus.DISABLED : PostStatus.ENABLED)
            .build();
    }

    havePicture(picture: Picture): boolean {
        return this.pictures.have(picture);
    }

    publisherIs(id: UserId) {
        return this.publisherId.equals(id);
    }
}

export { Post };

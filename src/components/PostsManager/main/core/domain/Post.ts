import { Title } from './Title';
import { PostId } from './PostId';
import { UserId } from './UserId';
import { Picture } from './Picture';
import { PostStatus } from './PostStatus';
import { Description } from './Description';
import { WilayaNumber } from './WilayaNumber';

import { PostBuilder } from './PostBuilder';

abstract class Post {
    protected abstract aBuilderFromThis(): PostBuilder;

    protected constructor(
        readonly postId: PostId,
        readonly title: Title,
        readonly description: Description,
        readonly wilayaNumber: WilayaNumber,
        readonly publisherId: UserId,
        readonly pictures: Picture[],
        readonly status: PostStatus,
        readonly createdAt: Date,
    ) {}

    toggleEnablingStatus() {
        return this.aBuilderFromThis()
            .withStatus(this.status === 'ENABLED' ? PostStatus.DISABLED : PostStatus.ENABLED)
            .build();
    }

    havePicture(picture: Picture): boolean {
        const found = this.pictures.find(pic => pic.equals(picture));

        return !!found;
    }
}

export { Post };

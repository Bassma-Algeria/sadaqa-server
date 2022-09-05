import { CreatePostUseCaseRequest } from './CreatePostUseCaseRequest';

import { Post } from '../../../domain/Post';
import { Title } from '../../../domain/Title';
import { UserId } from '../../../domain/UserId';
import { PostStatus } from '../../../domain/PostStatus';
import { Description } from '../../../domain/Description';
import { PostBuilder } from '../../../domain/PostBuilder';
import { PostPictures } from '../../../domain/PostPictures';
import { WilayaNumber } from '../../../domain/WilayaNumber';

import { UsersService } from '../../../domain/services/UsersService';
import { WilayasService } from '../../../domain/services/WilayasService';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { PostIdGenerator } from '../../../domain/services/PostIdGenerator';
import { PostRepository } from '../../../domain/services/PostRepository/base/PostRepository';
import { PostEventPublisher } from '../../../domain/services/PostEventPublisher/base/PostEventPublisher';

import { ExceptionMessages } from '../../../domain/exceptions/ExceptionMessages';
import { AuthorizationException } from '../../../domain/exceptions/AuthorizationException';
import { MultiLanguagesValidationException } from '../../../domain/exceptions/MultiLanguagesValidationException';

abstract class CreatePostUseCase {
    protected abstract isPublisherAuthorized(id: UserId): Promise<boolean>;

    protected abstract getInitialPostStatus(): PostStatus;

    protected abstract getEmptyPostBuilder(): PostBuilder;

    protected constructor(
        protected readonly usersService: UsersService,
        protected readonly wilayasService: WilayasService,
        protected readonly postIdGenerator: PostIdGenerator,
        protected readonly picturesManager: PicturesManager,
        protected readonly postRepository: PostRepository<Post>,
        protected readonly posEventPublisher: PostEventPublisher<Post>,
    ) {}

    protected async validatePostInfoAndGetHydratedPostBuilderFrom(
        request: CreatePostUseCaseRequest,
    ) {
        const { title, description } = this.getTitleAndDescriptionFrom(request);
        const wilayaNumber = await this.validateAndGetWilayaNumberFrom(request);
        const publisherId = await this.validateAndGetPublisherIdFrom(request);
        const pictures = await this.uploadPicturesFrom(request);
        const status = this.getInitialPostStatus();
        const postId = this.getRandomPostId();
        const createdAt = this.now();

        return this.getEmptyPostBuilder()
            .withPostId(postId)
            .withTitle(title)
            .withDescription(description)
            .withWilayaNumber(wilayaNumber)
            .withPublisherId(publisherId)
            .withPictures(pictures)
            .withCreatedAt(createdAt)
            .withStatus(status);
    }

    private getTitleAndDescriptionFrom(request: CreatePostUseCaseRequest) {
        const title = new Title(request.title);
        const description = new Description(request.description);

        return { title, description };
    }

    private async validateAndGetWilayaNumberFrom(request: CreatePostUseCaseRequest) {
        const wilayaNumber = new WilayaNumber(request.wilayaNumber);

        const isExist = await this.wilayasService.isExist(wilayaNumber);
        if (!isExist)
            throw new MultiLanguagesValidationException(ExceptionMessages.INVALID_WILAYA_NUMBER);

        return wilayaNumber;
    }

    private async validateAndGetPublisherIdFrom(request: CreatePostUseCaseRequest) {
        const publisherId = new UserId(request.publisherId);

        const isAuthorized = await this.isPublisherAuthorized(publisherId);
        if (!isAuthorized)
            throw new AuthorizationException(ExceptionMessages.NOT_AUTHORIZED_TO_PUBLISH);

        return publisherId;
    }

    private async uploadPicturesFrom(request: CreatePostUseCaseRequest) {
        return new PostPictures(await this.picturesManager.upload(request.pictures));
    }

    private getRandomPostId() {
        return this.postIdGenerator.nextId();
    }

    private now() {
        return new Date();
    }

    protected async savePost(post: Post) {
        await this.postRepository.save(post);
    }

    protected publishPostCreatedEvent(post: Post) {
        this.posEventPublisher.publishPostCreated(post);
    }
}

export { CreatePostUseCase };

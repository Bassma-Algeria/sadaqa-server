import { Title } from '../../../domain/Title';
import { PostId } from '../../../domain/PostId';
import { UserId } from '../../../domain/UserId';
import { Picture } from '../../../domain/Picture';
import { Description } from '../../../domain/Description';
import { WilayaNumber } from '../../../domain/WilayaNumber';

import { Post } from '../../../domain/Post';
import { PostBuilder } from '../../../domain/PostBuilder';

import { NotFoundException } from '../../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../../domain/exceptions/ExceptionMessages';
import { ValidationException } from '../../../domain/exceptions/ValidationException';
import { AuthorizationException } from '../../../domain/exceptions/AuthorizationException';
import { MultiLanguagesValidationException } from '../../../domain/exceptions/MultiLanguagesValidationException';

import { WilayasService } from '../../../domain/services/WilayasService';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { PostRepository } from '../../../domain/services/PostRepository/base/PostRepository';
import { PostEventPublisher } from '../../../domain/services/PostEventPublisher/base/PostEventPublisher';

import { UpdatePostUseCaseRequest } from './UpdatePostUseCaseRequest';

abstract class UpdatePostUseCase {
    protected abstract getPostBuilderFrom(post: Post): PostBuilder;

    protected constructor(
        private readonly wilayasService: WilayasService,
        private readonly picturesManager: PicturesManager,
        private readonly postRepository: PostRepository<Post>,
        private readonly postEventPublisher: PostEventPublisher<Post>,
    ) {}

    protected async processAndValidatePostInfoAndGetHydratedPostBuilderFrom(
        request: UpdatePostUseCaseRequest,
    ) {
        const { postId, userId, title, wilayaNumber, description } = this.getFrom(request);

        await this.checkIfWilayaExistThrowIfNot(wilayaNumber);

        const post = await this.findPostByIdThrowIfNotExist(postId);

        this.checkIfPublisherIsEditRequesterThrowIfNot(post, userId);
        this.checkIfPostHaveOldPicturesSentThrowIfNot(post, request);

        const { pictures } = await this.getNewPicsFrom(request);

        await this.deletePostPicturesThatAreNotPresentInRequest(post, request);

        return this.getPostBuilderFrom(post)
            .withTitle(title)
            .withWilayaNumber(wilayaNumber)
            .withDescription(description)
            .withPictures(pictures);
    }

    private getFrom(request: UpdatePostUseCaseRequest) {
        const title = new Title(request.title);
        const postId = new PostId(request.postId);
        const userId = new UserId(request.userId);
        const description = new Description(request.description);
        const wilayaNumber = new WilayaNumber(request.wilayaNumber);

        return { postId, userId, title, wilayaNumber, description };
    }

    private async findPostByIdThrowIfNotExist(postId: PostId) {
        const post = await this.postRepository.findById(postId);

        if (!post) throw new NotFoundException(ExceptionMessages.POST_NOT_FOUND);

        return post;
    }

    private checkIfPublisherIsEditRequesterThrowIfNot(post: Post, userId: UserId) {
        if (!post.publisherId.equals(userId))
            throw new AuthorizationException(ExceptionMessages.NOT_AUTHORIZED_TO_EDIT);
    }

    private async checkIfWilayaExistThrowIfNot(wilayaNumber: WilayaNumber) {
        const isWilayaExist = await this.wilayasService.isExist(wilayaNumber);

        if (!isWilayaExist)
            throw new MultiLanguagesValidationException(ExceptionMessages.INVALID_WILAYA_NUMBER);
    }

    private checkIfPostHaveOldPicturesSentThrowIfNot(
        post: Post,
        request: UpdatePostUseCaseRequest,
    ) {
        for (const pic of request.pictures.old)
            if (!post.havePicture(new Picture(pic)))
                throw new ValidationException(ExceptionMessages.POST_PICTURE_NOT_EXIST);
    }

    private async getNewPicsFrom({ pictures }: UpdatePostUseCaseRequest) {
        const oldPictures = pictures.old.map(pic => new Picture(pic));

        const newPictures = await this.picturesManager.upload(pictures.new);

        return { pictures: [...oldPictures, ...newPictures] };
    }

    private async deletePostPicturesThatAreNotPresentInRequest(
        post: Post,
        request: UpdatePostUseCaseRequest,
    ) {
        const picturesToKeep = request.pictures.old.map(pic => new Picture(pic));

        function picturesToKeepContains(picture: Picture) {
            return picturesToKeep.some(pic => pic.equals(picture));
        }

        for (const pictureInPost of post.pictures) {
            if (!picturesToKeepContains(pictureInPost)) {
                await this.picturesManager.delete(pictureInPost);
            }
        }
    }

    protected async updatePost(post: Post) {
        await this.postRepository.update(post);
    }

    protected publishPostUpdatedEvent(post: Post) {
        this.postEventPublisher.publishPostUpdated(post);
    }
}

export { UpdatePostUseCase };

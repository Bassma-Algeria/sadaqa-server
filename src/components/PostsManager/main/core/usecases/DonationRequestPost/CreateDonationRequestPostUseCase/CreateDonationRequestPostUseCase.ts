import { UseCase } from '../../UseCase';
import { CreateDonationRequestPostUseCaseRequest } from './CreateDonationRequestPostUseCaseRequest';
import { CreateDonationRequestPostUseCaseResponse } from './CreateDonationRequestPostUseCaseResponse';

import { Title } from '../../../domain/Title';
import { Description } from '../../../domain/Description';
import { PublisherId } from '../../../domain/PublisherId';
import { WilayaNumber } from '../../../domain/WilayaNumber';
import { DonationCategory } from '../../../domain/DonationCategory';

import { DonationRequestPost } from '../../../domain/DonationRequestPost';

import { UsersService } from '../../../domain/services/UsersService';
import { PostsEventBus } from '../../../domain/services/PostsEventBus';
import { WilayasService } from '../../../domain/services/WilayasService';
import { PostIdGenerator } from '../../../domain/services/PostIdGenerator';
import { PicturesUploader } from '../../../domain/services/PicturesUploader';
import { DonationRequestPostRepository } from '../../../domain/services/DonationRequestPostRepository';

import { InvalidPublisherIdException } from '../../../domain/exceptions/InvalidPublisherIdException';
import { InvalidWilayaNumberException } from '../../../domain/exceptions/InvalidWilayaNumberException';

class CreateDonationRequestPostUseCase
  implements
    UseCase<CreateDonationRequestPostUseCaseRequest, CreateDonationRequestPostUseCaseResponse>
{
  constructor(
    private readonly usersService: UsersService,
    private readonly wilayasService: WilayasService,
    private readonly picturesUploader: PicturesUploader,
    private readonly postIdGenerator: PostIdGenerator,
    private readonly donationRequestPostRepository: DonationRequestPostRepository,
    private readonly postsEventBus: PostsEventBus,
  ) {}

  async handle(
    request: CreateDonationRequestPostUseCaseRequest,
  ): Promise<CreateDonationRequestPostUseCaseResponse> {
    const { title, description, category } = this.getDonationBasicInfoFrom(request);
    const { wilayaNumber } = await this.validateAndGetWilayaNumberFrom(request);
    const { publisherId } = await this.validateAndGetPublisherIdFrom(request);
    const { pictures } = await this.uploadPicturesFrom(request);
    const { createdAt } = this.getCreatedAt();
    const { postId } = this.generatePostId();

    const post: DonationRequestPost = DonationRequestPost.aBuilder()
      .withPostId(postId)
      .withTitle(title)
      .withDescription(description)
      .withCategory(category)
      .withWilayaNumber(wilayaNumber)
      .withPublisherId(publisherId)
      .withPictures(pictures)
      .withCreatedAt(createdAt)
      .build();

    await this.saveThis(post);

    this.publishDonationRequestPostCreatedEvent(post);

    return { postId: post.postId.value() };
  }

  private async validateAndGetPublisherIdFrom(request: CreateDonationRequestPostUseCaseRequest) {
    const publisherId = new PublisherId(request.publisherId);

    const isPublisherExist = await this.usersService.isExist(publisherId);
    if (!isPublisherExist) throw new InvalidPublisherIdException();

    return { publisherId };
  }

  private async validateAndGetWilayaNumberFrom(request: CreateDonationRequestPostUseCaseRequest) {
    const wilayaNumber = new WilayaNumber(request.wilayaNumber);

    const isWilayaExist = await this.wilayasService.isExist(wilayaNumber);
    if (!isWilayaExist) throw new InvalidWilayaNumberException();

    return { wilayaNumber };
  }

  private getDonationBasicInfoFrom(request: CreateDonationRequestPostUseCaseRequest) {
    const title = new Title(request.title);
    const description = new Description(request.description);
    const category = new DonationCategory(request.category);

    return { title, description, category };
  }

  private async uploadPicturesFrom(request: CreateDonationRequestPostUseCaseRequest) {
    return { pictures: await this.picturesUploader.upload(request.pictures) };
  }

  private generatePostId() {
    return { postId: this.postIdGenerator.nextId() };
  }

  private getCreatedAt() {
    return { createdAt: new Date() };
  }

  private async saveThis(post: DonationRequestPost) {
    await this.donationRequestPostRepository.save(post);
  }

  private publishDonationRequestPostCreatedEvent(post: DonationRequestPost) {
    this.postsEventBus.publishDonationRequestPostCreated(post);
  }
}

export { CreateDonationRequestPostUseCase };

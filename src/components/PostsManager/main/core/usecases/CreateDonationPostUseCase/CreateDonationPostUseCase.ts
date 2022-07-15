import { UseCase } from '../UseCase';
import { CreateDonationPostUseCaseRequest } from './CreateDonationPostUseCaseRequest';
import { CreateDonationPostUseCaseResponse } from './CreateDonationPostUseCaseResponse';

import { DonationPost } from '../../domain/DonationPost';

import { Title } from '../../domain/Title';
import { Description } from '../../domain/Description';
import { PublisherId } from '../../domain/PublisherId';
import { WilayaNumber } from '../../domain/WilayaNumber';
import { DonationCategory } from '../../domain/DonationCategory';

import { UsersService } from '../../domain/services/UsersService';
import { PostsEventBus } from '../../domain/services/PostsEventBus';
import { WilayasService } from '../../domain/services/WilayasService';
import { DateTimeService } from '../../domain/services/DateTimeService';
import { PostIdGenerator } from '../../domain/services/PostIdGenerator';
import { PicturesUploader } from '../../domain/services/PicturesUploader';
import { DonationPostRepository } from '../../domain/services/DonationPostRepository';

import { InvalidPublisherIdException } from '../../domain/exceptions/InvalidPublisherIdException';
import { InvalidWilayaNumberException } from '../../domain/exceptions/InvalidWilayaNumberException';

class CreateDonationPostUseCase
  implements UseCase<CreateDonationPostUseCaseRequest, CreateDonationPostUseCaseResponse>
{
  constructor(
    private readonly usersService: UsersService,
    private readonly wilayasService: WilayasService,
    private readonly picturesUploader: PicturesUploader,
    private readonly postIdGenerator: PostIdGenerator,
    private readonly donationPostRepository: DonationPostRepository,
    private readonly dateTimeService: DateTimeService,
    private readonly postsEventBus: PostsEventBus,
  ) {}

  async handle(
    request: CreateDonationPostUseCaseRequest,
  ): Promise<CreateDonationPostUseCaseResponse> {
    const { title, description, category } = this.getDonationBasicInfoFrom(request);
    const { wilayaNumber } = await this.validateAndGetWilayaNumberFrom(request);
    const { publisherId } = await this.validateAndGetPublisherIdFrom(request);
    const { pictures } = await this.uploadPicturesFrom(request);
    const { createdAt } = this.getCreatedAt();
    const { postId } = this.generatePostId();

    const donationPost: DonationPost = DonationPost.aBuilder()
      .withPostId(postId)
      .withTitle(title)
      .withDescription(description)
      .withCategory(category)
      .withWilayaNumber(wilayaNumber)
      .withPublisherId(publisherId)
      .withPictures(pictures)
      .withCreatedAt(createdAt)
      .build();

    await this.saveThis(donationPost);

    this.publishDonationPostCreatedEvent(donationPost);

    return { postId: donationPost.postId.value() };
  }

  private async validateAndGetPublisherIdFrom(request: CreateDonationPostUseCaseRequest) {
    const publisherId = new PublisherId(request.publisherId);

    const isPublisherExist = await this.usersService.isExist(publisherId);
    if (!isPublisherExist) throw new InvalidPublisherIdException();

    return { publisherId };
  }

  private async validateAndGetWilayaNumberFrom(request: CreateDonationPostUseCaseRequest) {
    const wilayaNumber = new WilayaNumber(request.wilayaNumber);

    const isWilayaExist = await this.wilayasService.isExist(wilayaNumber);
    if (!isWilayaExist) throw new InvalidWilayaNumberException();

    return { wilayaNumber };
  }

  private getDonationBasicInfoFrom(request: CreateDonationPostUseCaseRequest) {
    const title = new Title(request.title);
    const description = new Description(request.description);
    const category = new DonationCategory(request.category);

    return { title, description, category };
  }

  private async uploadPicturesFrom(request: CreateDonationPostUseCaseRequest) {
    return { pictures: await this.picturesUploader.upload(request.pictures) };
  }

  private generatePostId() {
    return { postId: this.postIdGenerator.nextId() };
  }

  private getCreatedAt() {
    return { createdAt: this.dateTimeService.now() };
  }

  private async saveThis(post: DonationPost) {
    await this.donationPostRepository.save(post);
  }

  private publishDonationPostCreatedEvent(donationPost: DonationPost) {
    this.postsEventBus.publishDonationPostCreated(donationPost);
  }
}

export { CreateDonationPostUseCase };

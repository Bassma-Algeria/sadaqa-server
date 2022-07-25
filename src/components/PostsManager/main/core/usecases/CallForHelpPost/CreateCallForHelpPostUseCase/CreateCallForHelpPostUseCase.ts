import { UseCase } from '../../UseCase';
import { CreateCallForHelpPostUseCaseRequest } from './CreateCallForHelpPostUseCaseRequest';
import { CreateCallForHelpPostUseCaseResponse } from './CreateCallForHelpPostUseCaseResponse';

import { CCP } from '../../../domain/CCP';
import { Title } from '../../../domain/Title';
import { UserId } from '../../../domain/UserId';
import { Description } from '../../../domain/Description';
import { WilayaNumber } from '../../../domain/WilayaNumber';
import { BaridiMobNumber } from '../../../domain/BaridiMobNumber';

import { CallForHelpPost } from '../../../domain/CallForHelpPost';

import { UsersService } from '../../../domain/services/UsersService';
import { PostsEventPublisher } from '../../../domain/services/PostsEventPublisher';
import { WilayasService } from '../../../domain/services/WilayasService';
import { PostIdGenerator } from '../../../domain/services/PostIdGenerator';
import { PicturesUploader } from '../../../domain/services/PicturesUploader';
import { CallForHelpPostRepository } from '../../../domain/services/CallForHelpPostRepository';

import { InvalidWilayaNumberException } from '../../../domain/exceptions/InvalidWilayaNumberException';
import { NotAuthorizedToPublishThisPostException } from '../../../domain/exceptions/NotAuthorizedToPublishThisPostException';

class CreateCallForHelpPostUseCase
  implements UseCase<CreateCallForHelpPostUseCaseRequest, CreateCallForHelpPostUseCaseResponse>
{
  constructor(
    private readonly wilayasService: WilayasService,
    private readonly usersService: UsersService,
    private readonly picturesUploader: PicturesUploader,
    private readonly postIdGenerator: PostIdGenerator,
    private readonly callForHelpPostRepository: CallForHelpPostRepository,
    private readonly postsEventBus: PostsEventPublisher,
  ) {}

  async handle(
    request: CreateCallForHelpPostUseCaseRequest,
  ): Promise<CreateCallForHelpPostUseCaseResponse> {
    const { title, description } = this.getPostBasicInfoFrom(request);
    const { publisherId } = await this.validateAndGetPublisherIdFrom(request);
    const { wilayaNumber } = await this.validateAndGetWilayaNumberFrom(request);
    const { baridiMobNumber } = this.getBaridiMobNumberFrom(request);
    const { pictures } = await this.uploadPicturesFrom(request);
    const { postId } = this.getRandomPostId();
    const { ccp } = this.getCCPFrom(request);

    const post = CallForHelpPost.aBuilder()
      .withPostId(postId)
      .withTitle(title)
      .withDescription(description)
      .withWilayaNumber(wilayaNumber)
      .withPublisherId(publisherId)
      .withPictures(pictures)
      .withCCP(ccp)
      .withBaridiMobNumber(baridiMobNumber)
      .withCreatedAt(this.now())
      .build();

    await this.save(post);

    this.publishPostCreatedEvent(post);

    return { postId: post.postId.value() };
  }

  private async save(post: CallForHelpPost) {
    await this.callForHelpPostRepository.save(post);
  }

  private getPostBasicInfoFrom(request: CreateCallForHelpPostUseCaseRequest) {
    return {
      title: new Title(request.title),
      description: new Description(request.description),
    };
  }

  private async validateAndGetWilayaNumberFrom(request: CreateCallForHelpPostUseCaseRequest) {
    const wilayaNumber = new WilayaNumber(request.wilayaNumber);

    const isExist = await this.wilayasService.isExist(wilayaNumber);
    if (!isExist) throw new InvalidWilayaNumberException();

    return { wilayaNumber };
  }

  private async validateAndGetPublisherIdFrom(request: CreateCallForHelpPostUseCaseRequest) {
    const publisherId = new UserId(request.publisherId);

    const isActiveAssociation = await this.usersService.isActiveAssociation(publisherId);
    if (!isActiveAssociation) throw new NotAuthorizedToPublishThisPostException();

    return { publisherId };
  }

  private getCCPFrom(request: CreateCallForHelpPostUseCaseRequest) {
    let ccp: CCP | undefined;

    if (request.ccp || request.ccpKey) {
      ccp = new CCP(request.ccp!, request.ccpKey!);
    }

    return { ccp };
  }

  private getBaridiMobNumberFrom(request: CreateCallForHelpPostUseCaseRequest) {
    let baridiMobNumber: BaridiMobNumber | undefined;

    if (request.baridiMobNumber) {
      baridiMobNumber = new BaridiMobNumber(request.baridiMobNumber);
    }

    return { baridiMobNumber };
  }

  private async uploadPicturesFrom(request: CreateCallForHelpPostUseCaseRequest) {
    return { pictures: await this.picturesUploader.upload(request.pictures) };
  }

  private getRandomPostId() {
    return { postId: this.postIdGenerator.nextId() };
  }

  private now() {
    return new Date();
  }

  private publishPostCreatedEvent(post: CallForHelpPost) {
    this.postsEventBus.publishCallForHelpPostCreated(post);
  }
}

export { CreateCallForHelpPostUseCase };
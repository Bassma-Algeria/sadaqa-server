import { UseCase } from '../UseCase';
import { UploadPictureUseCaseRequest } from './UploadPictureUseCaseRequest';
import { UploadPictureUseCaseResponse } from './UploadPictureUseCaseResponse';

import { CloudService } from '../../domain/services/CloudService';
import { ImageCompressor } from '../../domain/services/ImageCompressor';
import { FileSystemService } from '../../domain/services/FilesSystemService';

import { Picture } from '../../domain/Picture';
import { FileSize } from '../../domain/FileSize';
import { LocalPath } from '../../domain/LocalPath';

import { CannotUploadNonImageFilesException } from './exception/CannotUploadNonImageFilesException';

class UploadPictureUseCase
  implements UseCase<UploadPictureUseCaseRequest, UploadPictureUseCaseResponse>
{
  constructor(
    private readonly cloudService: CloudService,
    private readonly fileSystemService: FileSystemService,
    private readonly imageCompressor: ImageCompressor,
  ) {}

  async handle(request: UploadPictureUseCaseRequest): Promise<UploadPictureUseCaseResponse> {
    const picturePath = new LocalPath(request.picturePath);

    await this.checkIfTheProvidedPathIsAnImageAndThrowOtherwise(picturePath);

    let picture = new Picture(picturePath);

    const size = await this.sizeof(picture);

    if (this.isBiggerThanOneMegaByte(size)) picture = await this.compress(picture);

    const url = await this.upload(picture);

    return { url: url.value() };
  }

  private async checkIfTheProvidedPathIsAnImageAndThrowOtherwise(picturePath: LocalPath) {
    const isImage = await this.fileSystemService.isImage(picturePath);

    if (!isImage) throw new CannotUploadNonImageFilesException();
  }

  private sizeof(picture: Picture) {
    return this.fileSystemService.sizeof(picture.path);
  }

  private isBiggerThanOneMegaByte(size: FileSize) {
    return size.inMegaBytes() >= 1;
  }

  private compress(picture: Picture): Picture | PromiseLike<Picture> {
    return this.imageCompressor.minify(picture);
  }

  private upload(picture: Picture) {
    return this.cloudService.upload(picture);
  }
}

export { UploadPictureUseCase };

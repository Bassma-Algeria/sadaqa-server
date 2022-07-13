import { UseCase } from '../UseCase';
import { UploadPictureUseCaseRequest } from './UploadPictureUseCaseRequest';
import { UploadPictureUseCaseResponse } from './UploadPictureUseCaseResponse';

import { CloudService } from '../../domain/services/CloudService';
import { ImageCompressor } from '../../domain/services/ImageCompressor';
import { FileSystemService } from '../../domain/services/FilesSystemService';

import { Picture } from '../../domain/Picture';
import { FileSize } from '../../domain/FileSize';
import { LocalPath } from '../../domain/LocalPath';

class UploadPictureUseCase
  implements UseCase<UploadPictureUseCaseRequest, UploadPictureUseCaseResponse>
{
  constructor(
    private readonly cloudService: CloudService,
    private readonly fileSystemService: FileSystemService,
    private readonly imageCompressor: ImageCompressor,
  ) {}

  async handle(request: UploadPictureUseCaseRequest): Promise<UploadPictureUseCaseResponse> {
    let picture = new Picture(new LocalPath(request.picturePath));

    const size = await this.sizeof(picture);

    if (this.isBiggerOrEqualToHalfOneMegaByte(size)) picture = await this.compress(picture);

    const url = await this.upload(picture);

    return { url: url.value() };
  }

  private sizeof(picture: Picture) {
    return this.fileSystemService.sizeof(picture.path);
  }

  private isBiggerOrEqualToHalfOneMegaByte(size: FileSize) {
    return size.inMegaBytes() >= 0.5;
  }

  private compress(picture: Picture): Picture | PromiseLike<Picture> {
    return this.imageCompressor.minify(picture);
  }

  private upload(picture: Picture) {
    return this.cloudService.upload(picture);
  }
}

export { UploadPictureUseCase };

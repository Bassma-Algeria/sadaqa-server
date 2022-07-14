import { UploadPictureUseCase } from './core/usecases/UploadPictureUseCase/UploadPictureUseCase';
import { UploadPictureUseCaseRequest } from './core/usecases/UploadPictureUseCase/UploadPictureUseCaseRequest';

import { CloudService } from './core/domain/services/CloudService';
import { FileSystemService } from './core/domain/services/FilesSystemService';
import { ImageCompressor } from './core/domain/services/ImageCompressor';

class MediaManagerFacade {
  constructor(
    private readonly cloudService: CloudService,
    private readonly fileSystemService: FileSystemService,
    private readonly imageCompressor: ImageCompressor,
  ) {}

  uploadPicture(request: UploadPictureUseCaseRequest) {
    return new UploadPictureUseCase(
      this.cloudService,
      this.fileSystemService,
      this.imageCompressor,
    ).handle(request);
  }
}

export { MediaManagerFacade };
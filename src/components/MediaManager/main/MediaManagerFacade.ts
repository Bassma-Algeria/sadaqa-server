import { UploadPictureUseCase } from './core/usecases/UploadPictureUseCase/UploadPictureUseCase';
import { UploadPictureUseCaseRequest } from './core/usecases/UploadPictureUseCase/UploadPictureUseCaseRequest';

import { DeletePictureUseCase } from './core/usecases/DeletePictureUseCase/DeletePictureUseCase';
import { DeletePictureUseCaseRequest } from './core/usecases/DeletePictureUseCase/DeletePictureUseCaseRequest';

import { CloudService } from './core/domain/services/CloudService';
import { PictureCompressor } from './core/domain/services/PictureCompressor';

class MediaManagerFacade {
    constructor(
        private readonly cloudService: CloudService,
        private readonly imageCompressor: PictureCompressor,
    ) {}

    uploadPicture(request: UploadPictureUseCaseRequest) {
        return new UploadPictureUseCase(this.cloudService, this.imageCompressor).handle(request);
    }

    deletePicture(request: DeletePictureUseCaseRequest) {
        return new DeletePictureUseCase(this.cloudService).handle(request);
    }
}

export { MediaManagerFacade };

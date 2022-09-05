import { UseCase } from '../UseCase';
import { UploadPictureUseCaseRequest } from './UploadPictureUseCaseRequest';
import { UploadPictureUseCaseResponse } from './UploadPictureUseCaseResponse';

import { FileSize } from '../../domain/FileSize';
import { PictureToUpload } from '../../domain/PictureToUpload';

import { CloudService } from '../../domain/services/CloudService';
import { PictureCompressor } from '../../domain/services/PictureCompressor';

class UploadPictureUseCase
    implements UseCase<UploadPictureUseCaseRequest, UploadPictureUseCaseResponse>
{
    private IMAGE_SIZE_THRESHOLD_IN_MG = 0.2;

    constructor(
        private readonly cloudService: CloudService,
        private readonly pictureCompressor: PictureCompressor,
    ) {}

    async handle(request: UploadPictureUseCaseRequest): Promise<UploadPictureUseCaseResponse> {
        let picture = new PictureToUpload(request.filename, request.buffer);

        if (this.isPicSizeBiggerOrEqualSizeThreshold(picture))
            picture = await this.compress(picture);

        const url = await this.upload(picture);

        return { url: url.value() };
    }

    private isPicSizeBiggerOrEqualSizeThreshold(picture: PictureToUpload) {
        const size = new FileSize(picture.sizeInBytes());

        return size.inMegaBytes() >= this.IMAGE_SIZE_THRESHOLD_IN_MG;
    }

    private compress(picture: PictureToUpload): PictureToUpload | PromiseLike<PictureToUpload> {
        return this.pictureCompressor.minify(picture);
    }

    private upload(picture: PictureToUpload) {
        return this.cloudService.uploadPicture(picture);
    }
}

export { UploadPictureUseCase };

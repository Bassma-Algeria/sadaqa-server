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
    constructor(
        private readonly cloudService: CloudService,
        private readonly pictureCompressor: PictureCompressor,
    ) {}

    async handle(request: UploadPictureUseCaseRequest): Promise<UploadPictureUseCaseResponse> {
        let picture = new PictureToUpload(request.picture);

        const size = await this.sizeof(picture);

        if (this.isBiggerOrEqualToHalfOneMegaByte(size)) picture = await this.compress(picture);

        const url = await this.upload(picture);

        return { url: url.value() };
    }

    private sizeof(picture: PictureToUpload) {
        return new FileSize(Buffer.byteLength(picture.buffer));
    }

    private isBiggerOrEqualToHalfOneMegaByte(size: FileSize) {
        return size.inMegaBytes() >= 0.5;
    }

    private compress(picture: PictureToUpload): PictureToUpload | PromiseLike<PictureToUpload> {
        return this.pictureCompressor.minify(picture);
    }

    private upload(picture: PictureToUpload) {
        return this.cloudService.uploadPicture(picture);
    }
}

export { UploadPictureUseCase };

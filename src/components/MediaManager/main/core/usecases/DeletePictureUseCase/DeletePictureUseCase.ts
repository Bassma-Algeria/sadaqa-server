import { UseCase } from '../UseCase';
import { DeletePictureUseCaseRequest } from './DeletePictureUseCaseRequest';

import { PictureUrl } from '../../domain/PictureUrl';

import { CloudService } from '../../domain/services/CloudService';

class DeletePictureUseCase implements UseCase<DeletePictureUseCaseRequest, void> {
    constructor(private readonly cloudService: CloudService) {}

    async handle(request: DeletePictureUseCaseRequest): Promise<void> {
        await this.cloudService.deletePicture(new PictureUrl(request.picUrl));
    }
}

export { DeletePictureUseCase };
import { faker } from '@faker-js/faker';
import { UploadPictureUseCaseRequest } from '../../../../main/core/usecases/UploadPictureUseCase/UploadPictureUseCaseRequest';

const anUploadPictureRequest = (): UploadPictureUseCaseRequest => {
  return { picturePath: faker.system.filePath() };
};

export { anUploadPictureRequest };

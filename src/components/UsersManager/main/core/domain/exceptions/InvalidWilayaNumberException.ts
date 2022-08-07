import { MultiLanguagesException } from './MultiLanguagesException';
import { ExceptionsMessages } from '../../usecases/RegisterUseCases/RegisterRegularUserUseCase/exeptions/ExceptionsMessages';

class InvalidWilayaNumberException extends MultiLanguagesException {
    constructor() {
        super(ExceptionsMessages.INVALID_WILAYA_NUMBER);
    }
}

export { InvalidWilayaNumberException };

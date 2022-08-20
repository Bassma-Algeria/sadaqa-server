import { UseCase } from '../UseCase';
import { LogInfoUseCaseRequest } from './LogInfoUseCaseRequest';

import { InformationLog } from '../../domain/InformationLog';

import { LogService } from '../../domain/services/LogService';

class LogInfoUseCase implements UseCase<LogInfoUseCaseRequest, void> {
    constructor(private readonly logService: LogService) {}

    async handle(request: LogInfoUseCaseRequest): Promise<void> {
        const log = new InformationLog(request.message, request.payload, new Date());

        await this.logService.info(log);
    }
}

export { LogInfoUseCase };

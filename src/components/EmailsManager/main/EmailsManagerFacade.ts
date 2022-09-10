import { SendAssociationApprovalEmailUseCase } from './core/usecases/SendAssociationApprovalEmailUseCase/SendAssociationApprovalEmailUseCase';
import { SendAssociationApprovalEmailUseCaseRequest } from './core/usecases/SendAssociationApprovalEmailUseCase/SendAssociationApprovalEmailUseCaseRequest';

import { EmailService } from './core/domain/services/EmailService';
import { EmailEventPublisher } from './core/domain/services/EmailEventPublisher';

class EmailsManagerFacade {
    constructor(
        private readonly emailService: EmailService,
        private readonly emailEventPublisher: EmailEventPublisher,
    ) {}

    sendAssociationApprovalEmail(request: SendAssociationApprovalEmailUseCaseRequest) {
        return new SendAssociationApprovalEmailUseCase(
            this.emailService,
            this.emailEventPublisher,
        ).handle(request);
    }
}

export { EmailsManagerFacade };

import { UseCase } from '../../UseCase';
import { EditAssociationAccountInfoUseCaseRequest } from './EditAssociationAccountInfoUseCaseRequest';
import { EditAssociationAccountInfoUseCaseResponse } from './EditAssociationAccountInfoUseCaseResponse';
import { AccountId } from '../../../domain/AccountId';
import { AssociationName } from '../../../domain/AssociationName';
import { AssociationAccount } from '../../../domain/AssociationAccount';
import { AssociationAccountBuilder } from '../../../domain/AssociationAccountBuilder';
import { ProfilePictureUpdater } from '../../../domain/ProfilePictureUpdater';

import { EditAccountInfoUseCase } from '../base/EditAccountInfoUseCase';

import { AssociationAccountDtoMapper } from '../../_common_/dtos/AssociationAccountDtoMapper';

import { WilayasService } from '../../../domain/services/WilayasService';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';

class EditAssociationAccountInfoUseCase
    extends EditAccountInfoUseCase
    implements
        UseCase<
            EditAssociationAccountInfoUseCaseRequest,
            EditAssociationAccountInfoUseCaseResponse
        >
{
    constructor(
        protected readonly wilayasService: WilayasService,
        protected readonly picturesManager: PicturesManager,
        protected readonly userEventPublisher: UserEventPublisher,
        protected readonly regularUserAccountRepository: RegularUserAccountRepository,
        protected readonly associationAccountRepository: AssociationAccountRepository,
    ) {
        super(
            wilayasService,
            picturesManager,
            regularUserAccountRepository,
            associationAccountRepository,
        );
    }

    async handle(
        request: EditAssociationAccountInfoUseCaseRequest,
    ): Promise<EditAssociationAccountInfoUseCaseResponse> {
        const { accountBuilder } = await this.validateDataAndGetBasicAccountBuilderFrom(request);

        const associationName = new AssociationName(request.associationName);

        const editedAccount = (accountBuilder as AssociationAccountBuilder)
            .withName(associationName)
            .build();

        await editedAccount
            .updateProfilePicture(request.profilePicture)
            .using(new ProfilePictureUpdater(this.picturesManager));

        await this.associationAccountRepository.update(editedAccount);

        this.userEventPublisher.publishAssociationAccountInfoEdited(editedAccount);

        return AssociationAccountDtoMapper.getInstance().toDto(editedAccount);
    }

    protected findAccountById(id: AccountId) {
        return this.associationAccountRepository.findById(id);
    }

    protected getAccountBuilderFrom(account: AssociationAccount) {
        return AssociationAccount.aBuilderFrom(account);
    }
}

export { EditAssociationAccountInfoUseCase };

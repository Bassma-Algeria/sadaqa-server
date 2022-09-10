import { UseCase } from '../../UseCase';
import { EditRegularUserAccountInfoUseCaseRequest } from './EditRegularUserAccountInfoUseCaseRequest';
import { EditRegularUserAccountInfoUseCaseResponse } from './EditRegularUserAccountInfoUseCaseResponse';

import { LastName } from '../../../domain/LastName';
import { FirstName } from '../../../domain/FirstName';
import { AccountId } from '../../../domain/AccountId';
import { RegularUserAccount } from '../../../domain/RegularUserAccount';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { RegularUserAccountBuilder } from '../../../domain/RegularUserAccountBuilder';

import { ProfilePictureUpdater } from '../../../domain/ProfilePictureUpdater';

import { EditAccountInfoUseCase } from '../base/EditAccountInfoUseCase';

import { RegularUserAccountDtoMapper } from '../../_common_/dtos/RegularUserAccountDtoMapper';

import { WilayasService } from '../../../domain/services/WilayasService';
import { UserEventPublisher } from '../../../domain/services/UserEventPublisher';
import { RegularUserAccountRepository } from '../../../domain/services/AccountRepository/RegularUserAccountRepository';
import { AssociationAccountRepository } from '../../../domain/services/AccountRepository/AssociationAccountRepository';

class EditRegularUserAccountInfoUseCase
    extends EditAccountInfoUseCase
    implements
        UseCase<
            EditRegularUserAccountInfoUseCaseRequest,
            EditRegularUserAccountInfoUseCaseResponse
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
        request: EditRegularUserAccountInfoUseCaseRequest,
    ): Promise<EditRegularUserAccountInfoUseCaseResponse> {
        const { accountBuilder } = await this.validateDataAndGetBasicAccountBuilderFrom(request);

        const lastName = new LastName(request.lastName);
        const firstName = new FirstName(request.firstName);

        const editedAccount = (accountBuilder as RegularUserAccountBuilder)
            .withFirstName(firstName)
            .withLastName(lastName)
            .build();

        await editedAccount
            .updateProfilePicture(request.profilePicture)
            .using(new ProfilePictureUpdater(this.picturesManager));

        await this.regularUserAccountRepository.update(editedAccount);

        this.userEventPublisher.publishRegularUserAccountInfoEdited(editedAccount);

        return RegularUserAccountDtoMapper.getInstance().toDto(editedAccount);
    }

    protected findAccountById(id: AccountId) {
        return this.regularUserAccountRepository.findById(id);
    }

    protected getAccountBuilderFrom(account: RegularUserAccount) {
        return RegularUserAccount.aBuilderFrom(account);
    }
}

export { EditRegularUserAccountInfoUseCase };

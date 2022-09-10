import { Account } from './Account';
import { ProfilePicture } from './ProfilePicture';

import { PicturesManager } from './services/PicturesManager';
import { ExceptionMessages } from './exceptions/ExceptionMessages';
import { ValidationException } from './exceptions/ValidationException';

export type NewProfilePicture = { buffer: Buffer; filename: string } | string | null;

class ProfilePictureUpdater {
    constructor(private readonly picturesManager: PicturesManager) {}

    async update(account: Account, newPicture: NewProfilePicture): Promise<void> {
        if (!newPicture) return await this.deleteProfilePicture(account);

        if (typeof newPicture === 'string') return this.keepSameProfilePicture(account, newPicture);

        return await this.changeProfilePicture(account, newPicture);
    }

    private keepSameProfilePicture(account: Account, newPicUrl: string) {
        if (!account.getProfilePicture()?.equals(new ProfilePicture(newPicUrl)))
            throw new ValidationException(ExceptionMessages.PROFILE_PIC_SENT_NOT_THE_OLD_PIC);
    }

    private async changeProfilePicture(
        account: Account,
        newPicture: { buffer: Buffer; filename: string },
    ) {
        if (account.haveProfilePicture())
            await this.picturesManager.deleteProfilePicture(account.getProfilePicture()!);

        account.setProfilePicture(await this.picturesManager.uploadProfilePicture(newPicture));
    }

    private async deleteProfilePicture(account: Account) {
        if (account.haveProfilePicture())
            await this.picturesManager.deleteProfilePicture(account.getProfilePicture()!);

        account.removeProfilePicture();
    }
}

export { ProfilePictureUpdater };

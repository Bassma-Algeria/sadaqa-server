import { Injectable } from '@nestjs/common';

import { NotificationsManagerConfiguration } from '../../../../components/NotificationsManager/main/NotificationsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { Service } from './base/base.service';

@Injectable()
class NotificationsService extends Service {
    private readonly notificationsManager =
        NotificationsManagerConfiguration.aNotificationsManager();

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async getNotifications(accessToken: string) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.notificationsManager.getNotifications({ receiverId: userId });
        } catch (e) {
            await this.logError('Error while getting notifications', e);

            throw e;
        }
    }

    async getNumberOfUnreadNotifications(accessToken: string) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.notificationsManager.getNumberOfUnreadNotification({
                receiverId: userId,
            });
        } catch (e) {
            await this.logError('Error while getting number of unread notifications', e);

            throw e;
        }
    }

    async makeNotificationRead(accessToken: string, notificationId: string) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.notificationsManager.makeNotificationRead({
                notificationId,
                userId,
            });
        } catch (e) {
            await this.logError('Error while making notification read', e);

            throw e;
        }
    }

    async makeNotificationClicked(accessToken: string, notificationId: string) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.notificationsManager.makeNotificationClicked({
                notificationId,
                userId,
            });
        } catch (e) {
            await this.logError('Error while making notification clicked', e);

            throw e;
        }
    }
}

export { NotificationsService };

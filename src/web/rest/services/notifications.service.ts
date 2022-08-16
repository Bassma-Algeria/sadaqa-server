import { Injectable } from '@nestjs/common';

import { NotificationsManagerConfiguration } from '../../../components/NotificationsManager/main/NotificationsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

@Injectable()
class NotificationsService {
    private readonly notificationsManager =
        NotificationsManagerConfiguration.aNotificationsManager();

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async getNotifications(accessToken: string) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return await this.notificationsManager.getNotifications({ receiverId: userId });
    }

    async getNumberOfUnreadNotifications(accessToken: string) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return await this.notificationsManager.getNumberOfUnreadNotification({
            receiverId: userId,
        });
    }

    async makeNotificationRead(accessToken: string, notificationId: string) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return await this.notificationsManager.makeNotificationRead({
            notificationId,
            userId,
        });
    }

    async makeNotificationClicked(accessToken: string, notificationId: string) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return await this.notificationsManager.makeNotificationClicked({
            notificationId,
            userId,
        });
    }
}

export { NotificationsService };

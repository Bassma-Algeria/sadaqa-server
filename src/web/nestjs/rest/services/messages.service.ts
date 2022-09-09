import { Injectable } from '@nestjs/common';

import { UsersManagerConfiguration } from '../../../../components/UsersManager/main/UsersManagerConfiguration';
import { MessagesManagerConfiguration } from '../../../../components/MessagesManager/main/MessagesManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { SendTextMessageUseCaseRequest } from '../../../../components/MessagesManager/main/core/usecases/SendMessageUseCases/SendTextMessageUseCase/SendTextMessageUseCaseRequest';
import { GetConversationUseCaseRequest } from '../../../../components/MessagesManager/main/core/usecases/GetConversationUseCase/GetConversationUseCaseRequest';
import { MakeMessageReadUseCaseRequest } from '../../../../components/MessagesManager/main/core/usecases/MakeMessageReadUseCase/MakeMessageReadUseCaseRequest';

import { Service } from './base/base.service';

@Injectable()
class MessagesService extends Service {
    private readonly messagesManager = MessagesManagerConfiguration.aMessagesManager();
    private readonly usersManager = UsersManagerConfiguration.aUsersManager();

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async sendTextMessage(
        accessToken: string,
        request: Omit<SendTextMessageUseCaseRequest, 'senderId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.messagesManager.sendTextMessage({ ...request, senderId: userId });
        } catch (e) {
            await this.logError('Error while sending Text Message', e);

            throw e;
        }
    }

    async getContactsList(accessToken: string) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.messagesManager.getContactsList({ userId });
        } catch (e) {
            await this.logError('Error while Getting Contacts list', e);

            throw e;
        }
    }

    async getConversation(
        accessToken: string,
        request: Omit<GetConversationUseCaseRequest, 'between' | 'and'> & { with: string },
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.messagesManager.getConversation({
                between: userId,
                and: request.with,
                page: request.page,
            });
        } catch (e) {
            await this.logError('Error while getting conversation', e);

            throw e;
        }
    }

    async makeMessageRead(
        accessToken: string,
        request: Omit<MakeMessageReadUseCaseRequest, 'userId'>,
    ) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.messagesManager.makeMessageRead({ ...request, userId });
        } catch (e) {
            await this.logError('Error while making message read', e);

            throw e;
        }
    }

    async getUnreadMessagesNumber(accessToken: string) {
        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            return await this.messagesManager.getUnreadMessagesNumber({ receiverId: userId });
        } catch (e) {
            await this.logError('Error while getting unread messages', e);

            throw e;
        }
    }
}

export { MessagesService };

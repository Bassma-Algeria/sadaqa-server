import { Injectable } from '@nestjs/common';
import { SendTextMessageUseCaseRequest } from '../../../components/MessagesManager/main/core/usecases/SendMessageUseCases/SendTextMessageUseCase/SendTextMessageUseCaseRequest';
import { AuthenticationManagerConfiguration } from '../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';
import { MessagesManagerConfiguration } from '../../../components/MessagesManager/main/MessagesManagerConfiguration';
import { GetConversationUseCaseRequest } from '../../../components/MessagesManager/main/core/usecases/GetConversationUseCase/GetConversationUseCaseRequest';
import { MakeMessageReadUseCaseRequest } from '../../../components/MessagesManager/main/core/usecases/MakeMessageReadUseCase/MakeMessageReadUseCaseRequest';
import { UsersManagerConfiguration } from '../../../components/UsersManager/main/UsersManagerConfiguration';

@Injectable()
class MessagesService {
    private readonly messagesManager = MessagesManagerConfiguration.aMessagesManager();
    private readonly usersManager = UsersManagerConfiguration.aUsersManager();

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    async sendTextMessage(
        accessToken: string,
        request: Omit<SendTextMessageUseCaseRequest, 'senderId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return await this.messagesManager.sendTextMessage({ ...request, senderId: userId });
    }

    async getContactsList(accessToken: string) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return await this.messagesManager.getContactsList({ userId });
    }

    async getConversation(
        accessToken: string,
        request: Omit<GetConversationUseCaseRequest, 'between' | 'and'> & { with: string },
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return await this.messagesManager.getConversation({
            between: userId,
            and: request.with,
            page: request.page,
        });
    }

    async makeMessageRead(
        accessToken: string,
        request: Omit<MakeMessageReadUseCaseRequest, 'userId'>,
    ) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return await this.messagesManager.makeMessageRead({ ...request, userId });
    }

    async getUnreadMessagesNumber(accessToken: string) {
        const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

        return await this.messagesManager.getUnreadMessagesNumber({ receiverId: userId });
    }
}

export { MessagesService };

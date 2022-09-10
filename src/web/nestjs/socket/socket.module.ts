import { Module } from '@nestjs/common';

import { UsersGateway } from './gateways/users.gateway';
import { MessagesGateway } from './gateways/messages.gateway';
import { NotificationsGateway } from './gateways/notifications.gateway';

@Module({
    providers: [UsersGateway, NotificationsGateway, MessagesGateway],
})
export class SocketModule {}

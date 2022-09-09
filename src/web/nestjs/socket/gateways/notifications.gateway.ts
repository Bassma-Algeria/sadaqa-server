import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

import { BaseGateway } from './base/base.gateway';

import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { orchestrateNotificationsEventsWithSocketServer } from '../../../../components/EventsOrchestration/external/socket/orchestrateNotificationsEventsWithSocketServer';

@WebSocketGateway({ namespace: 'notifications' })
class NotificationsGateway extends BaseGateway implements OnGatewayConnection, OnGatewayInit {
    @WebSocketServer() private wss!: Namespace;

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    afterInit(server: Namespace) {
        orchestrateNotificationsEventsWithSocketServer(server);
    }

    async handleConnection(client: Socket) {
        const { authorization: accessToken } = client.handshake.headers;
        if (!accessToken) return client.disconnect();

        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            client.join(userId);
        } catch (e) {
            await this.logError(
                'Error while handling new socket connection to notifications namespace',
                e,
            );

            client.disconnect();
        }
    }
}

export { NotificationsGateway };

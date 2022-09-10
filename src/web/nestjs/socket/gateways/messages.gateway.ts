import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

import { BaseGateway } from './base/base.gateway';

import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { orchestrateMessagesEventsWithSocketServer } from '../../../../components/EventsOrchestration/external/socket/orchestrateMessagesEventsWithSocketServer';

@WebSocketGateway({ namespace: 'messages' })
class MessagesGateway extends BaseGateway implements OnGatewayConnection, OnGatewayInit {
    @WebSocketServer() private wss!: Namespace;

    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    afterInit(server: Namespace) {
        orchestrateMessagesEventsWithSocketServer(server);
    }

    async handleConnection(client: Socket) {
        const { authorization: accessToken } = client.handshake.headers;
        if (!accessToken) return client.disconnect();

        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            client.join(userId);
        } catch (e) {
            await this.logError(
                'Error while handling new socket connection to messages namespace',
                e,
            );

            client.disconnect();
        }
    }
}

export { MessagesGateway };

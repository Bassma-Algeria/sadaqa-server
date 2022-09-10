import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

import { BaseGateway } from './base/base.gateway';

import { orchestrateUsersEventsWithSocketServer } from '../../../../components/EventsOrchestration/external/socket/orchestrateUsersEventsWithSocketServer';

import { UsersManagerConfiguration } from '../../../../components/UsersManager/main/UsersManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

@WebSocketGateway({ namespace: 'users' })
class UsersGateway
    extends BaseGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer() private wss!: Namespace;

    private readonly usersManager = UsersManagerConfiguration.aUsersManager();
    private readonly authenticationManager =
        AuthenticationManagerConfiguration.anAuthenticationManager();

    afterInit(server: Namespace) {
        orchestrateUsersEventsWithSocketServer(server);
    }

    async handleConnection(client: Socket) {
        const { authorization: accessToken } = client.handshake.headers;
        if (!accessToken) return;

        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            await this.usersManager.userBecameOnline({ accountId: userId });
        } catch (e) {
            await this.logError('Error while handling new socket connection to users namespace', e);

            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        const { authorization: accessToken } = client.handshake.headers;
        if (!accessToken) return;

        if (this.isUserConnectedWithMoreThanOneDevice(client)) return;

        try {
            const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

            await this.usersManager.userGoOffline({ accountId: userId });
        } catch (e) {
            await this.logError(
                'Error while handling socket disconnection from users namespace',
                e,
            );
        }
    }

    private isUserConnectedWithMoreThanOneDevice(client: Socket): boolean {
        for (const socket of this.wss.sockets.values())
            if (isSameUser(socket) && differentSocketClient(socket)) return true;

        return false;

        function isSameUser(socket: Socket) {
            return (
                socket.handshake.headers.authorization === client.handshake.headers.authorization
            );
        }

        function differentSocketClient(socket: Socket) {
            return socket.id !== client.id;
        }
    }
}

export { UsersGateway };

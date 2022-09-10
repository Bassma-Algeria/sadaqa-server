import { Module, OnModuleInit } from '@nestjs/common';

import { RestModule } from './rest/rest.module';
import { SocketModule } from './socket/socket.module';

import { orchestrateAllInternalEvents } from '../../components/EventsOrchestration/internal/orchestrateAllInternalEvents';

@Module({
    imports: [RestModule, SocketModule],
})
export class AppModule implements OnModuleInit {
    onModuleInit() {
        orchestrateAllInternalEvents();
    }
}

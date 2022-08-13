import { NotificationsService } from '../services/notifications.service';
import { Controller, Get, Headers, HttpException, HttpStatus } from '@nestjs/common';
import {
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { TokenException } from '../../../components/AuthenticationManager/main/core/domain/exception/TokenException';

@ApiTags('notifications')
@Controller('/api/notifications')
class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get('/')
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiOkResponse({ description: 'notification returned successfully' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getNotifications(@Headers('Authorisation') accessToken: string) {
        try {
            return await this.notificationsService.getNotifications(accessToken);
        } catch (e) {
            NotificationsController.handleError(e);
        }
    }

    private static handleError(e: unknown) {
        if (e instanceof TokenException)
            throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);

        throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export { NotificationsController };
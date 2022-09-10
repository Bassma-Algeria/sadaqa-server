import { NotificationsService } from '../services/notifications.service';
import { Controller, Get, Headers, HttpException, HttpStatus, Param, Put } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { TokenException } from '../../../../components/AuthenticationManager/main/core/domain/exception/TokenException';
import { NotFoundException } from '../../../../components/NotificationsManager/main/core/domain/exceptions/NotFoundException';
import { AuthorizationException } from '../../../../components/NotificationsManager/main/core/domain/exceptions/AuthorizationException';

@ApiTags('notifications')
@Controller('/api/notifications')
class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get('/')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'notification returned successfully' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getNotifications(@Headers('Authorization') accessToken: string) {
        try {
            return await this.notificationsService.getNotifications(accessToken);
        } catch (e) {
            NotificationsController.handleError(e);
        }
    }

    @Get('/total-unread')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'total unread notifications returned successfully' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getTotalUnread(@Headers('Authorization') accessToken: string) {
        try {
            return await this.notificationsService.getNumberOfUnreadNotifications(accessToken);
        } catch (e) {
            NotificationsController.handleError(e);
        }
    }

    @Put('/:notificationId/read')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'total unread notifications returned successfully' })
    @ApiNotFoundResponse({ description: 'notification not found' })
    @ApiForbiddenResponse({ description: 'not the receiver of the notification' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async makeRead(
        @Param('notificationId') id: string,
        @Headers('Authorization') accessToken: string,
    ) {
        try {
            return await this.notificationsService.makeNotificationRead(accessToken, id);
        } catch (e) {
            NotificationsController.handleError(e);
        }
    }

    @Put('/:notificationId/clicked')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'total unread notifications returned successfully' })
    @ApiNotFoundResponse({ description: 'notification not found' })
    @ApiForbiddenResponse({ description: 'not the receiver of the notification' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async makeClicked(
        @Param('notificationId') id: string,
        @Headers('Authorization') accessToken: string,
    ) {
        try {
            return await this.notificationsService.makeNotificationClicked(accessToken, id);
        } catch (e) {
            NotificationsController.handleError(e);
        }
    }

    private static handleError(e: unknown) {
        if (e instanceof TokenException)
            throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
        if (e instanceof NotFoundException)
            throw new HttpException({ error: e.message }, HttpStatus.NOT_FOUND);
        if (e instanceof AuthorizationException)
            throw new HttpException({ error: e.message }, HttpStatus.FORBIDDEN);

        throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export { NotificationsController };

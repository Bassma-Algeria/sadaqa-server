import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';

import { SendTextMessageDto } from './dtos/messages.dtos';

import { MessagesService } from '../services/messages.service';

import { TokenException } from '../../../../components/AuthenticationManager/main/core/domain/exception/TokenException';
import { NotFoundException } from '../../../../components/MessagesManager/main/core/domain/exceptions/NotFoundException';
import { ValidationException } from '../../../../components/MessagesManager/main/core/domain/exceptions/ValidationException';

@ApiTags('messages')
@Controller('/api/messages')
class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post('text')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiCreatedResponse({ description: 'message sent successfully' })
    @ApiBadRequestResponse({ description: 'error in the body sent' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async sendTextMessage(
        @Body() body: SendTextMessageDto,
        @Headers('Authorization') accessToken: string,
    ) {
        try {
            return await this.messagesService.sendTextMessage(accessToken, body);
        } catch (e) {
            MessagesController.handleError(e);
        }
    }

    @Put(':messageId/read')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'message made read successfully' })
    @ApiNotFoundResponse({ description: 'no message found' })
    @ApiBadRequestResponse({ description: 'message already read' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async makeMessageRead(
        @Param('messageId') messageId: string,
        @Headers('Authorization') accessToken: string,
    ) {
        try {
            return await this.messagesService.makeMessageRead(accessToken, { messageId });
        } catch (e) {
            MessagesController.handleError(e);
        }
    }

    @Get('contacts')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'contacts list found' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getContactsList(@Headers('Authorization') accessToken: string) {
        try {
            return await this.messagesService.getContactsList(accessToken);
        } catch (e) {
            MessagesController.handleError(e);
        }
    }

    @Get('conversation')
    @ApiBearerAuth()
    @ApiQuery({ name: 'with', description: 'the chat participant id' })
    @ApiQuery({ name: 'page', description: 'page number, default: 1', required: false })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'conversation found' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getConversation(
        @Query('page') page: string,
        @Query('with') chatParticipantId: string,
        @Headers('Authorization') accessToken: string,
    ) {
        try {
            return await this.messagesService.getConversation(accessToken, {
                page: Number(page),
                with: chatParticipantId,
            });
        } catch (e) {
            MessagesController.handleError(e);
        }
    }

    @Get('total-unread')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'unread messages returned' })
    @ApiUnauthorizedResponse({ description: 'invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getUnreadMessagesNumber(@Headers('Authorization') accessToken: string) {
        try {
            return await this.messagesService.getUnreadMessagesNumber(accessToken);
        } catch (e) {
            MessagesController.handleError(e);
        }
    }

    private static handleError(e: unknown) {
        if (e instanceof TokenException)
            throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
        if (e instanceof ValidationException)
            throw new HttpException({ error: e.message }, HttpStatus.BAD_REQUEST);
        if (e instanceof NotFoundException)
            throw new HttpException({ error: e.message }, HttpStatus.NOT_FOUND);

        throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export { MessagesController };

import {
    Controller,
    Headers,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Put,
} from '@nestjs/common';
import {
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserNotFoundException } from '../../../components/UsersManager/main/core/domain/exceptions/UserNotFoundException';

import { AdminService, InvalidAdminPasswordException } from '../services/admin.service';

@ApiTags('admin')
@Controller('/admin')
class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Put('associations/:associationId/activate')
    @HttpCode(204)
    @ApiHeader({ name: 'Authorisation', description: 'the admin password' })
    @ApiResponse({ description: 'association activated successfully', status: 204 })
    @ApiNotFoundResponse({ description: 'no association found' })
    @ApiUnauthorizedResponse({ description: 'wrong Authorisation header' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async activateAssociation(
        @Param('associationId') associationId: string,
        @Headers('Authorisation') adminPassword: string,
    ) {
        try {
            return await this.adminService.activateAssociation(adminPassword, { associationId });
        } catch (e) {
            if (e instanceof UserNotFoundException)
                throw new HttpException({ error: 'association not found' }, HttpStatus.NOT_FOUND);
            if (e instanceof InvalidAdminPasswordException) {
                throw new HttpException({ error: 'not authorized' }, HttpStatus.UNAUTHORIZED);
            }

            throw new HttpException({ error: 'server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

export { AdminController };

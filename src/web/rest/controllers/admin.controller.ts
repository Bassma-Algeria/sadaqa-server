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

import { AdminService, InvalidAdminPasswordException } from '../services/admin.service';
import { NotFoundException } from '../../../components/UsersManager/main/core/domain/exceptions/NotFoundException';

@ApiTags('admin')
@Controller('/admin')
class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Put('associations/:accountId/activate')
    @HttpCode(204)
    @ApiHeader({ name: 'Authorisation', description: 'the admin password' })
    @ApiResponse({ description: 'association activated successfully', status: 204 })
    @ApiNotFoundResponse({ description: 'no association found' })
    @ApiUnauthorizedResponse({ description: 'wrong Authorisation header' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async activateAssociation(
        @Param('accountId') accountId: string,
        @Headers('Authorisation') adminPassword: string,
    ) {
        try {
            return await this.adminService.activateAssociation(adminPassword, { accountId });
        } catch (e) {
            if (e instanceof NotFoundException)
                throw new HttpException({ error: e.message }, HttpStatus.NOT_FOUND);
            if (e instanceof InvalidAdminPasswordException) {
                throw new HttpException({ error: 'not authorized' }, HttpStatus.UNAUTHORIZED);
            }

            throw new HttpException({ error: 'server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

export { AdminController };

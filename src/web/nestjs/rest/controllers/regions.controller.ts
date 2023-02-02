import {
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';

import { RegionsService } from '../services/regions.service';
import { NotFoundException } from '../../../../components/RegionsManager/main/core/domain/exceptions/NotFoundException';

@ApiTags('regions')
@Controller('/api/regions')
class RegionsController {
    constructor(private readonly regionsService: RegionsService) {}

    @Get('wilayas')
    @ApiOkResponse({ description: 'Wilayas Found' })
    @ApiInternalServerErrorResponse({ description: 'Server Error' })
    getAllWilayas() {
        return this.regionsService.getAllWilayas();
    }

    @Get('wilayas/:wilayaNumber')
    @ApiOkResponse({ description: 'Wilaya Found' })
    @ApiNotFoundResponse({ description: 'Wilaya Not Found' })
    @ApiInternalServerErrorResponse({ description: 'Server Error' })
    async getWilaya(@Param('wilayaNumber') wilayaNumber: string) {
        try {
            return await this.regionsService.getWilaya({ code: Number(wilayaNumber) });
        } catch (e) {
            if (e instanceof NotFoundException)
                throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

            throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

export { RegionsController };

import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';

import { WilayaNotExistException } from '../../../components/RegionsManager/main/core/domain/exceptions/WilayaNotExistException';

import { RegionsService } from '../services/regions.service';

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
      return await this.regionsService.getWilaya({ wilayaNumber: Number(wilayaNumber) });
    } catch (e) {
      if (e instanceof WilayaNotExistException)
        throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export { RegionsController };
import { RegionsService } from '../services/regions.service';
import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';

import { WilayaNotExistException } from '../../../components/RegionsManager/main/core/domain/exceptions/WilayaNotExistException';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('regions')
@Controller('/api/regions')
class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get('wilayas')
  getAllWilayas() {
    return this.regionsService.getAllWilayas();
  }

  @Get('wilayas/:wilayaNumber')
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
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PostsService } from '../services/posts.service';

import { DonationPostNotFoundException } from '../../../components/PostsManager/main/core/usecases/GetDonationPostUseCase/exceptions/DonationPostNotFoundException';
import { GetDonationsPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/GetDonationsPostsUseCase/GetDonationsPostsUseCaseRequest';
import { InvalidWilayaNumberException } from '../../../components/PostsManager/main/core/domain/exceptions/InvalidWilayaNumberException';
import { CategoryNotSupportedException } from '../../../components/PostsManager/main/core/domain/exceptions/CategoryNotSupportedException';
import { CreateDonationPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';
import {
  MultiLanguagesException,
  SupportedLangugaes,
} from '../../../components/PostsManager/main/core/domain/exceptions/MultiLanguagesException';

@ApiTags('posts')
@Controller('/api/posts')
class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('donations/:postId')
  async getDonationPostById(@Param('postId') postId: string) {
    try {
      return await this.postsService.getDonationById({ postId });
    } catch (e) {
      if (e instanceof DonationPostNotFoundException)
        throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('donations')
  async getDonationsPosts(@Query() queryParams: GetDonationsPostsUseCaseRequest) {
    try {
      return await this.postsService.getDonations(queryParams);
    } catch (e) {
      if (e instanceof InvalidWilayaNumberException || e instanceof CategoryNotSupportedException)
        throw new HttpException({ error: e.message }, HttpStatus.BAD_REQUEST);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('donations')
  @UseInterceptors(FilesInterceptor('pictures'))
  async createDonationPost(
    @Body() body: Exclude<CreateDonationPostUseCaseRequest, 'publisherId' | 'pictures'>,
    @UploadedFiles() pictures: Array<Express.Multer.File>,
    @Headers('Authorisation') accessToken: string,
    @Headers('Accept-Language') language: SupportedLangugaes,
  ) {
    try {
      return await this.postsService.createNewDonation(accessToken, {
        ...body,
        pictures: pictures.map(pic => pic.path),
      });
    } catch (e) {
      if (e instanceof MultiLanguagesException)
        throw new HttpException({ error: e.errorMessage[language] }, HttpStatus.BAD_REQUEST);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export { PostsController };

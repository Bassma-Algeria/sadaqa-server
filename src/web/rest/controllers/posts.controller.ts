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
// eslint-disable-next-line node/no-extraneous-import
import { Express } from 'express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CreateDonationDto } from './dtos/posts.dtos';
import { PostsService } from '../services/posts.service';

import { DonationCategory } from '../../../components/PostsManager/main/core/domain/DonationCategory';

import { GetDonationsPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/GetDonationsPostsUseCase/GetDonationsPostsUseCaseRequest';

import {
  MultiLanguagesException,
  SupportedLangugaes,
} from '../../../components/PostsManager/main/core/domain/exceptions/MultiLanguagesException';
import { InvalidTokenException } from '../../../components/AuthenticationManager/main/core/domain/exception/InvalidTokenException';
import { InvalidWilayaNumberException } from '../../../components/PostsManager/main/core/domain/exceptions/InvalidWilayaNumberException';
import { CategoryNotSupportedException } from '../../../components/PostsManager/main/core/domain/exceptions/CategoryNotSupportedException';
import { DonationPostNotFoundException } from '../../../components/PostsManager/main/core/usecases/GetDonationPostUseCase/exceptions/DonationPostNotFoundException';

@ApiTags('posts')
@Controller('/api/posts')
class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('donations/:donationId')
  @ApiOkResponse({ description: 'Donation Found' })
  @ApiNotFoundResponse({ description: 'Donation Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getDonationPostById(@Param('donationId') donationId: string) {
    try {
      return await this.postsService.getDonationById({ postId: donationId });
    } catch (e) {
      if (e instanceof DonationPostNotFoundException)
        throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('donations')
  @ApiQuery({
    name: 'category',
    enum: DonationCategory.SUPPORTED_CATEGORIES,
  })
  @ApiQuery({ name: 'wilayaNumber', type: 'number', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiOkResponse({ description: 'Donations Found' })
  @ApiBadRequestResponse({ description: 'Error In the query params provided' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getDonationsPosts(@Query() queryParams: GetDonationsPostsUseCaseRequest) {
    try {
      return await this.postsService.getDonations({
        ...queryParams,
        page: Number(queryParams.page),
        wilayaNumber: Number(queryParams.wilayaNumber),
      });
    } catch (e) {
      if (e instanceof InvalidWilayaNumberException || e instanceof CategoryNotSupportedException)
        throw new HttpException({ error: e.message }, HttpStatus.BAD_REQUEST);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('donations')
  @ApiConsumes('multipart/form-data')
  @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
  @ApiHeader({ name: 'Authorisation', description: 'the access token' })
  @ApiCreatedResponse({ description: 'donation post created successfully' })
  @ApiBadRequestResponse({ description: 'error in the form body data' })
  @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  @UseInterceptors(FilesInterceptor('pictures'))
  async createDonationPost(
    @Body() body: CreateDonationDto,
    @UploadedFiles() pictures: Array<Express.Multer.File>,
    @Headers('Authorisation') accessToken: string,
    @Headers('Accept-Language') language: SupportedLangugaes,
  ) {
    try {
      return await this.postsService.createNewDonation(accessToken, {
        ...body,
        wilayaNumber: Number(body.wilayaNumber),
        pictures: pictures.map(pic => pic.buffer),
      });
    } catch (e) {
      if (e instanceof MultiLanguagesException)
        throw new HttpException({ error: e.errorMessage[language] }, HttpStatus.BAD_REQUEST);
      if (e instanceof InvalidTokenException)
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);

      console.log(e);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export { PostsController };

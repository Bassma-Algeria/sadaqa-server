import {
  Body,
  Controller,
  Delete,
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
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
  CreateCallForHelpDto,
  CreateDonationDto,
  CreateDonationRequestDto,
  CreateFamilyInNeedDto,
  FavouritePostDto,
} from './dtos/posts.dtos';
import { PostsService } from '../services/posts.service';

import { DonationCategory } from '../../../components/PostsManager/main/core/domain/DonationCategory';

import { GetDonationsPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationPost/GetDonationsPostsUseCase/GetDonationsPostsUseCaseRequest';
import { GetCallForHelpPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/CallForHelpPost/GetCallForHelpPostsUseCase/GetCallForHelpPostsUseCaseRequest';
import { GetFamiliesInNeedPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/FamilyInNeedPost/GetFamiliesInNeedPostsUseCase/GetFamiliesInNeedPostsUseCaseRequest';
import { GetDonationRequestsPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationRequestPost/GetDonationRequestsPostsUseCase/GetDonationRequestsPostsUseCaseRequest';

import {
  MultiLanguagesException,
  SupportedLangugaes,
} from '../../../components/PostsManager/main/core/domain/exceptions/MultiLanguagesException';
import { PostNotFoundException } from '../../../components/PostsManager/main/core/domain/exceptions/PostNotFoundException';
import { InvalidTokenException } from '../../../components/AuthenticationManager/main/core/domain/exception/InvalidTokenException';
import { InvalidUserIdException } from '../../../components/PostsManager/main/core/domain/exceptions/InvalidUserIdException';
import { NotAuthorizedToPublishThisPostException } from '../../../components/PostsManager/main/core/domain/exceptions/NotAuthorizedToPublishThisPostException';
import { ValidationException } from '../../../components/PostsManager/main/core/domain/exceptions/ValidationException';
import { InvalidAccessTokenException } from '../../../components/AuthenticationManager/main/core/domain/exception/InvalidAccessTokenException';

@ApiTags('posts')
@Controller('/api/posts')
class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('donations/:donationId')
  @ApiOkResponse({ description: 'DonationPost Found' })
  @ApiNotFoundResponse({ description: 'DonationPost Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getDonationPostById(@Param('donationId') donationId: string) {
    try {
      return await this.postsService.getDonationById({ postId: donationId });
    } catch (e) {
      if (e instanceof PostNotFoundException)
        throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('donations')
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'wilayaNumber', type: 'number', required: false })
  @ApiQuery({ name: 'category', enum: DonationCategory.SUPPORTED_CATEGORIES })
  @ApiOkResponse({ description: 'Donations Found' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getDonationsPosts(@Query() queryParams: GetDonationsPostsUseCaseRequest) {
    try {
      return await this.postsService.getDonations({
        ...queryParams,
        page: Number(queryParams.page),
        wilayaNumber: Number(queryParams.wilayaNumber),
      });
    } catch (e) {
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
      if (
        e instanceof InvalidTokenException ||
        e instanceof InvalidAccessTokenException ||
        e instanceof InvalidUserIdException
      )
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('donation-requests/:donationRequestId')
  @ApiOkResponse({ description: 'DonationPost Found' })
  @ApiNotFoundResponse({ description: 'DonationPost Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getDonationRequestPostById(@Param('donationRequestId') postId: string) {
    try {
      return await this.postsService.getDonationRequestById({ postId });
    } catch (e) {
      if (e instanceof PostNotFoundException)
        throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('donation-requests')
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'wilayaNumber', type: 'number', required: false })
  @ApiOkResponse({ description: 'Donation Requests Found' })
  @ApiBadRequestResponse({ description: 'Error In the query params provided' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getDonationRequestPosts(@Query() queryParams: GetDonationRequestsPostsUseCaseRequest) {
    try {
      return await this.postsService.getDonationRequests({
        page: Number(queryParams.page),
        wilayaNumber: Number(queryParams.wilayaNumber),
      });
    } catch (e) {
      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('donation-requests')
  @ApiConsumes('multipart/form-data')
  @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
  @ApiHeader({ name: 'Authorisation', description: 'the access token' })
  @ApiCreatedResponse({ description: 'donation request post created successfully' })
  @ApiBadRequestResponse({ description: 'error in the form body data' })
  @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  @UseInterceptors(FilesInterceptor('pictures'))
  async createDonationRequestPost(
    @Body() body: CreateDonationRequestDto,
    @UploadedFiles() pictures: Array<Express.Multer.File>,
    @Headers('Authorisation') accessToken: string,
    @Headers('Accept-Language') language: SupportedLangugaes,
  ) {
    try {
      return await this.postsService.createDonationRequest(accessToken, {
        ...body,
        wilayaNumber: Number(body.wilayaNumber),
        pictures: pictures.map(pic => pic.buffer),
      });
    } catch (e) {
      if (e instanceof MultiLanguagesException)
        throw new HttpException({ error: e.errorMessage[language] }, HttpStatus.BAD_REQUEST);
      if (
        e instanceof InvalidTokenException ||
        e instanceof InvalidAccessTokenException ||
        e instanceof InvalidUserIdException
      )
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('families-in-need/:familyInNeedId')
  @ApiOkResponse({ description: 'Family In Need Found' })
  @ApiNotFoundResponse({ description: 'Family In Need Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getFamilyInNeedPostById(@Param('familyInNeedId') familyInNeedId: string) {
    try {
      return await this.postsService.getFamilyInNeedById({ postId: familyInNeedId });
    } catch (e) {
      if (e instanceof PostNotFoundException)
        throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('families-in-need')
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'wilayaNumber', type: 'number', required: false })
  @ApiOkResponse({ description: 'Families in need Found' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getFamiliesInNeedPosts(@Query() queryParams: GetFamiliesInNeedPostsUseCaseRequest) {
    try {
      return await this.postsService.getFamiliesInNeed({
        page: Number(queryParams.page),
        wilayaNumber: Number(queryParams.wilayaNumber),
      });
    } catch (e) {
      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('families-in-need')
  @ApiConsumes('multipart/form-data')
  @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
  @ApiHeader({ name: 'Authorisation', description: 'the access token' })
  @ApiCreatedResponse({ description: 'family in need post created successfully' })
  @ApiBadRequestResponse({ description: 'error in the form body data' })
  @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
  @ApiForbiddenResponse({ description: 'a regular user try to add a family in need' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  @UseInterceptors(FilesInterceptor('pictures'))
  async createFamilyInNeedPost(
    @Body() body: CreateFamilyInNeedDto,
    @UploadedFiles() pictures: Array<Express.Multer.File>,
    @Headers('Authorisation') accessToken: string,
    @Headers('Accept-Language') language: SupportedLangugaes,
  ) {
    try {
      return await this.postsService.createNewFamilyInNeed(accessToken, {
        ...body,
        wilayaNumber: Number(body.wilayaNumber),
        pictures: pictures.map(pic => pic.buffer),
      });
    } catch (e) {
      if (e instanceof MultiLanguagesException)
        throw new HttpException({ error: e.errorMessage[language] }, HttpStatus.BAD_REQUEST);
      if (e instanceof InvalidTokenException || e instanceof InvalidAccessTokenException)
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
      if (e instanceof NotAuthorizedToPublishThisPostException)
        throw new HttpException(
          { error: 'Only Association can publish this post' },
          HttpStatus.FORBIDDEN,
        );

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('calls-for-help/:callForHelpId')
  @ApiOkResponse({ description: 'Family In Need Found' })
  @ApiNotFoundResponse({ description: 'Family In Need Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getCallForHelpPostById(@Param('callForHelpId') postId: string) {
    try {
      return await this.postsService.getCallForHelpById({ postId });
    } catch (e) {
      if (e instanceof PostNotFoundException)
        throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('calls-for-help')
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'wilayaNumber', type: 'number', required: false })
  @ApiOkResponse({ description: 'Families in need Found' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  async getCallForHelpPosts(@Query() queryParams: GetCallForHelpPostsUseCaseRequest) {
    try {
      return await this.postsService.getCallsForHelp({
        page: Number(queryParams.page),
        wilayaNumber: Number(queryParams.wilayaNumber),
      });
    } catch (e) {
      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('calls-for-help')
  @ApiConsumes('multipart/form-data')
  @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
  @ApiHeader({ name: 'Authorisation', description: 'the access token' })
  @ApiCreatedResponse({ description: 'family in need post created successfully' })
  @ApiBadRequestResponse({ description: 'error in the form body data' })
  @ApiForbiddenResponse({ description: 'a regular user try to add a call for help' })
  @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  @UseInterceptors(FilesInterceptor('pictures'))
  async createCallForHelpPost(
    @Body() body: CreateCallForHelpDto,
    @UploadedFiles() pictures: Array<Express.Multer.File>,
    @Headers('Authorisation') accessToken: string,
    @Headers('Accept-Language') language: SupportedLangugaes,
  ) {
    try {
      return await this.postsService.createNewCallForHelp(accessToken, {
        ...body,
        wilayaNumber: Number(body.wilayaNumber),
        pictures: pictures.map(pic => pic.buffer),
      });
    } catch (e) {
      if (e instanceof MultiLanguagesException)
        throw new HttpException({ error: e.errorMessage[language] }, HttpStatus.BAD_REQUEST);
      if (e instanceof InvalidTokenException || e instanceof InvalidAccessTokenException)
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
      if (e instanceof NotAuthorizedToPublishThisPostException)
        throw new HttpException(
          { error: 'Only Association can publish this post' },
          HttpStatus.FORBIDDEN,
        );

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('favourite')
  @ApiHeader({ name: 'Authorisation', description: 'the access token' })
  @ApiCreatedResponse({ description: 'post added to favourite successfully' })
  @ApiBadRequestResponse({ description: 'error in the form body data' })
  @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  async addToFavourite(
    @Body() body: FavouritePostDto,
    @Headers('Authorisation') accessToken: string,
  ) {
    try {
      return await this.postsService.addToFavourite(accessToken, body);
    } catch (e) {
      if (e instanceof InvalidTokenException || e instanceof InvalidAccessTokenException)
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
      if (e instanceof ValidationException)
        throw new HttpException({ error: e.message }, HttpStatus.BAD_REQUEST);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('favourite')
  @ApiHeader({ name: 'Authorisation', description: 'the access token' })
  @ApiOkResponse({ description: 'favourite posts found' })
  @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  async getFavourite(@Headers('Authorisation') accessToken: string) {
    try {
      return await this.postsService.getFavouritePosts(accessToken);
    } catch (e) {
      if (e instanceof InvalidTokenException || e instanceof InvalidAccessTokenException)
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('favourite')
  @ApiHeader({ name: 'Authorisation', description: 'the access token' })
  @ApiOkResponse({ description: 'favourite post deleted successfully' })
  @ApiBadRequestResponse({ description: 'error in the form body data' })
  @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  async deleteFavourite(
    @Headers('Authorisation') accessToken: string,
    @Body() body: FavouritePostDto,
  ) {
    try {
      return await this.postsService.deleteFavouritePost(accessToken, body);
    } catch (e) {
      if (e instanceof InvalidTokenException || e instanceof InvalidAccessTokenException)
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
      if (e instanceof ValidationException)
        throw new HttpException({ error: e.message }, HttpStatus.BAD_REQUEST);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export { PostsController };

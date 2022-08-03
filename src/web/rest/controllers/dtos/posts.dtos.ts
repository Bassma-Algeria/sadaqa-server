import { ApiProperty } from '@nestjs/swagger';

import { PostType } from '../../../../components/PostsManager/main/core/domain/PostType';
import { DonationCategory } from '../../../../components/PostsManager/main/core/domain/DonationCategory';

class CreateDonationDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
    readonly category!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly pictures!: any[];
}

class UpdateDonationDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
    readonly category!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ description: 'the urls of the old pictures to keep' })
    readonly oldPictures!: string[];

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly newPictures!: any[];
}

class CreateDonationRequestDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
    readonly category!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly pictures!: any[];
}

class UpdateDonationRequestDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
    readonly category!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ description: 'the urls of the old pictures to keep' })
    readonly oldPictures!: string[];

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly newPictures!: any[];
}

class CreateFamilyInNeedDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly pictures!: any[];

    @ApiProperty()
    readonly ccp?: string;

    @ApiProperty()
    readonly ccpKey?: string;

    @ApiProperty()
    readonly baridiMobNumber?: string;
}

class CreateCallForHelpDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly pictures!: any[];

    @ApiProperty()
    readonly ccp?: string;

    @ApiProperty()
    readonly ccpKey?: string;

    @ApiProperty()
    readonly baridiMobNumber?: string;
}

class UpdateCallForHelpDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ description: 'the urls of the old pictures to keep' })
    readonly oldPictures!: string[];

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly newPictures!: any[];

    @ApiProperty()
    readonly ccp?: string;

    @ApiProperty()
    readonly ccpKey?: string;

    @ApiProperty()
    readonly baridiMobNumber?: string;
}

class UpdateFamilyInNeedDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ description: 'the urls of the old pictures to keep' })
    readonly oldPictures!: string[];

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly newPictures!: any[];

    @ApiProperty()
    readonly ccp?: string;

    @ApiProperty()
    readonly ccpKey?: string;

    @ApiProperty()
    readonly baridiMobNumber?: string;
}

class FavouritePostDto {
    @ApiProperty()
    readonly postId!: string;

    @ApiProperty({ enum: PostType.POST_TYPES })
    readonly postType!: string;
}

export {
    CreateDonationDto,
    CreateFamilyInNeedDto,
    CreateCallForHelpDto,
    CreateDonationRequestDto,
    FavouritePostDto,
    UpdateCallForHelpDto,
    UpdateFamilyInNeedDto,
    UpdateDonationDto,
    UpdateDonationRequestDto,
};

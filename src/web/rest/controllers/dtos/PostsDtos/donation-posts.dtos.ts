import { ApiProperty } from '@nestjs/swagger';
import { DonationCategory } from '../../../../../components/PostsManager/main/core/domain/DonationCategory';
import { CreatePostDto, UpdatePostDto } from './base/post.dtos';

class CreateDonationDto extends CreatePostDto {
    @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
    readonly category!: string;
}

class UpdateDonationDto extends UpdatePostDto {
    @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
    readonly category!: string;
}

export { CreateDonationDto, UpdateDonationDto };
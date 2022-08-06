import { ApiProperty } from '@nestjs/swagger';
import { DonationCategory } from '../../../../../components/PostsManager/main/core/domain/DonationCategory';
import { CreatePostDto, UpdatePostDto } from './base/post.dtos';

class CreateDonationRequestDto extends CreatePostDto {
    @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
    readonly category!: string;
}

class UpdateDonationRequestDto extends UpdatePostDto {
    @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
    readonly category!: string;
}

export { UpdateDonationRequestDto, CreateDonationRequestDto };
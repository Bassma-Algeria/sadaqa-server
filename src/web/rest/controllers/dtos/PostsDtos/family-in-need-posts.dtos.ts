import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePostDto, UpdatePostDto } from './base/post.dtos';

class CreateFamilyInNeedDto extends CreatePostDto {
    @ApiPropertyOptional()
    readonly ccp?: string;

    @ApiPropertyOptional()
    readonly ccpKey?: string;

    @ApiPropertyOptional()
    readonly baridiMobNumber?: string;
}

class UpdateFamilyInNeedDto extends UpdatePostDto {
    @ApiPropertyOptional()
    readonly ccp?: string;

    @ApiPropertyOptional()
    readonly ccpKey?: string;

    @ApiPropertyOptional()
    readonly baridiMobNumber?: string;
}

export { UpdateFamilyInNeedDto, CreateFamilyInNeedDto };
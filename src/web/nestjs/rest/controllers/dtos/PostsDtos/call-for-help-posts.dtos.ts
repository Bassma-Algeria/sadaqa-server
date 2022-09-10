import { ApiPropertyOptional } from '@nestjs/swagger';

import { CreatePostDto, UpdatePostDto } from './base/post.dtos';

class CreateCallForHelpDto extends CreatePostDto {
    @ApiPropertyOptional()
    readonly ccp?: string;

    @ApiPropertyOptional()
    readonly ccpKey?: string;

    @ApiPropertyOptional()
    readonly baridiMobNumber?: string;
}

class UpdateCallForHelpDto extends UpdatePostDto {
    @ApiPropertyOptional()
    readonly ccp?: string;

    @ApiPropertyOptional()
    readonly ccpKey?: string;

    @ApiPropertyOptional()
    readonly baridiMobNumber?: string;
}

export { CreateCallForHelpDto, UpdateCallForHelpDto };
import { ApiProperty } from '@nestjs/swagger';

class SendTextMessageDto {
    @ApiProperty()
    receiverId!: string;

    @ApiProperty()
    message!: string;
}

export { SendTextMessageDto };
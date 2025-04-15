import { ApiProperty } from '@nestjs/swagger';

export class GeneratedContentResponseDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    kakaoUserId: string;

    @ApiProperty()
    generatedPostId: string;
}
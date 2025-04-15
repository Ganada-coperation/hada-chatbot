import {Controller, Get, Param} from "@nestjs/common";
import {GeneratedContentService} from "./service/generated.content.service";
import {GeneratedContentResponseDto} from "./dto/generated-content-response.dto";
import {GeneratedContentDocument} from "./schema/generated.content.schema";

@Controller('generated-content')
export class GeneratedContentController {
    constructor(private readonly generatedContentService: GeneratedContentService) {}

    @Get(':generatedPostId')
    async getContentByPostId(
        @Param('generatedPostId') generatedPostId: string,
    ): Promise<GeneratedContentResponseDto> {
        const result: GeneratedContentDocument =
            await this.generatedContentService.findByGeneratedPostId(generatedPostId);

        return {
            title: result.title,
            content: result.content,
            kakaoUserId: result.kakaoUserId,
            generatedPostId: result.generatedPostId
        };
    }
}
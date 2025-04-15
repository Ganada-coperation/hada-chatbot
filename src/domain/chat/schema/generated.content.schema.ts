import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BaseSchema} from "../../../common/base/base.schema";
import {v4 as uuidv4} from "uuid";
import {Document} from "mongoose";


@Schema({ timestamps: true })
export class GeneratedContent extends BaseSchema {

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    kakaoUserId: string;

    @Prop({ default: uuidv4, unique: true })
    generatedPostId: string;
}

export const GeneratedContentSchema = SchemaFactory.createForClass(GeneratedContent);
export type GeneratedContentDocument = GeneratedContent & Document;
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class BaseSchema {
    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Blog extends Document {
    @Prop({
        required: true,
        trim: true
    })
    title: string;

    @Prop({
        required: true,
        trim: true
    })
    description: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true
    })
    authorId: Types.ObjectId;

}

export const BlogSchema = SchemaFactory.createForClass(Blog);

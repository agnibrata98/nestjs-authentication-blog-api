import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({
        enum: ['user', 'admin'],
        default: 'user',
    })
    role: 'user' | 'admin';

}

export const UserSchema = SchemaFactory.createForClass(User);
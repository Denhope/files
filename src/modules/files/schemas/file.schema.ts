import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class File extends Document {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  storageKey: string;

  @Prop({ required: true })
  fileType: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const FileSchema = SchemaFactory.createForClass(File); 
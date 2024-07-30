import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Document } from "mongoose";
export type SubcriberDocument = HydratedDocument<Subcriber>;

@Schema({ timestamps: true })
export class Subcriber extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  skills: string[];

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;
}

export const SubcriberSchema = SchemaFactory.createForClass(Subcriber);

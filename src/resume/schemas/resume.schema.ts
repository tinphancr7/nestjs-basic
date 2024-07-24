import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date, HydratedDocument, Types } from "mongoose";
import { User, UserDocument } from "src/users/schemas/user.schema";

export type ResumeDocument = HydratedDocument<Resume>;
@Schema({ timestamps: true })
export class Resume {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: UserDocument;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: UserDocument;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: UserDocument;

  @Prop()
  isDeleted: boolean;

  //   @Prop()
  //   deleteAt: Date;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

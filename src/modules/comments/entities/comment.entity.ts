import * as mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Company } from "src/modules/companies/schemas/company.schema";
import { Job } from "src/modules/jobs/schemas/job.schema";
import { User } from "src/modules/users/schemas/user.schema";
import { Document } from "mongoose";
export enum COMMENT_TYPE {
  COMPANY = "COMPANY",
  JOB = "JOB",
}

export type CommentDocument = mongoose.HydratedDocument<Comment>;
@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
  })
  target_id: mongoose.Types.ObjectId | Company | Job;

  @Prop({
    enum: COMMENT_TYPE,
    required: true,
  })
  comment_type: COMMENT_TYPE;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Comment.name,
    default: null,
  })
  parent_id: mongoose.Types.ObjectId | Comment;

  @Prop({ required: false })
  current_path: string;

  @Prop({ default: 0 })
  total_liked: number;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
  })
  createdBy: mongoose.Types.ObjectId | User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

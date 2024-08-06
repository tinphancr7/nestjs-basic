import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { ResumeStatus } from "src/common/enum";

import { Company } from "src/modules/companies/schemas/company.schema";
import { Job } from "src/modules/jobs/schemas/job.schema";
import { User, UserDocument } from "src/modules/users/schemas/user.schema";
export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume extends Document {
  @Prop()
  email: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: UserDocument;

  @Prop({ required: true })
  url: string;

  @Prop({ required: false, default: ResumeStatus.PENDING })
  status: ResumeStatus;

  @Prop({ type: Types.ObjectId, ref: Company.name })
  company: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Job.name })
  job: Types.ObjectId;

  @Prop({ type: Types.Array })
  history: {
    status: string;
    updatedAt: Date;
    updatedBy: { type: Types.ObjectId };
  }[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

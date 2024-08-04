import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Document } from "mongoose";
import { Company } from "src/companies/schemas/company.schema";
export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  skills: string[];

  @Prop({ type: Types.ObjectId, ref: Company.name })
  company: Types.ObjectId;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);

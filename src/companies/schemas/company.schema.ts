import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { UserDocument } from "src/users/schemas/user.schema";

export type CompanyDocument = HydratedDocument<Company>;
@Schema({ timestamps: true })
export class Company {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: UserDocument;

  @Prop({ type: Types.ObjectId, ref: "User" })
  updatedBy: UserDocument;

  @Prop({ type: Types.ObjectId, ref: "User" })
  deletedBy: UserDocument;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

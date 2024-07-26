import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { Permission } from "src/permissions/schemas/permission.schema";

import { User } from "src/users/schemas/user.schema";
export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: [Types.ObjectId], ref: Permission.name })
  permissions: string[];

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

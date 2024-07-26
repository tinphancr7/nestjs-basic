import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";

import { User } from "src/users/schemas/user.schema";
export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission extends Document {
  @Prop()
  name: string;
  @Prop()
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

import { Types } from "mongoose";

export function toObjectId(id: any): Types.ObjectId {
  return new Types.ObjectId(id);
}

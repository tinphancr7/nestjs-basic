import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ObjectIdTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== "object" || value === null) {
      throw new BadRequestException("Validation failed");
    }

    this.transformObjectIds(value);
    return value;
  }

  private transformObjectIds(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === "string" && this.isObjectId(value)) {
          obj[key] = new Types.ObjectId(value);
        } else if (typeof value === "object" && value !== null) {
          this.transformObjectIds(value);
        }
      }
    }
  }

  private isObjectId(value: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(value);
  }
}

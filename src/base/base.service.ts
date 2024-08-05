import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { Model } from "mongoose";
import { toObjectId } from "src/utils";

@Injectable()
export abstract class BaseService<T> {
  constructor(private readonly model: Model<T>) {}

  async createData(createDto: any): Promise<T> {
    console.log("createData", createDto);
    try {
      const result = this.model.create({
        ...createDto,
      });
      return result;
    } catch (error) {
      throw new Error("Error creating entity");
    }
  }

  async findAllData({ query, populate }: { query: { page: number; limit: number }; populate?: any }): Promise<any> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    try {
      const findQuery = this.model.find().skip(skip).limit(limit).sort({ createdAt: "desc" }).lean();
      if (populate) {
        findQuery.populate(populate);
      }

      const [result, totalItems] = await Promise.all([findQuery.exec(), this.model.countDocuments().exec()]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        meta: {
          current: page,
          pageSize: limit,
          pages: totalPages,
          total: totalItems,
        },
        result,
      };
    } catch (error) {
      throw new Error("Error finding entities");
    }
  }

  async findOneData({ id, populate }: { id: string; populate?: any }): Promise<T> {
    try {
      const findQuery = this.model.findById(id);

      if (populate) {
        findQuery.populate(populate);
      }

      const entity = await findQuery.exec();

      if (!entity) {
        throw new NotFoundException("Entity not found");
      }
      return entity;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      } else if (error.name === "CastError" && error.kind === "ObjectId") {
        throw new BadRequestException("Invalid ID format");
      } else {
        throw new InternalServerErrorException("Internal server error");
      }
    }
  }

  async updateData({ id, updateDto }: { id: string; updateDto: any }): Promise<T> {
    try {
      const updatedEntity = await this.model
        .findByIdAndUpdate(
          toObjectId(id),
          {
            ...updateDto,
          },
          { new: true },
        )
        .exec();

      if (!updatedEntity) {
        throw new NotFoundException("Entity not found");
      }
      return updatedEntity;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new Error("Internal server error");
    }
  }

  async removeData({ id }: { id: string }): Promise<T> {
    try {
      const deletedEntity = await this.model.findByIdAndDelete(id).exec();
      if (!deletedEntity) {
        throw new NotFoundException("Entity not found");
      }
      return deletedEntity;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new Error("Internal server error");
    }
  }
}

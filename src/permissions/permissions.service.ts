import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { toObjectId } from "src/utils";
import { IUser } from "src/users/users.interface";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { Permission, PermissionDocument } from "./schemas/permission.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UpdatePermissionDto } from "./dto/update-permission.dto";

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { method, apiPath, name, module } = createPermissionDto;
    const isExist = await this.permissionModel.findOne({ method, apiPath });
    if (isExist) {
      throw new BadRequestException("Permission already exists");
    }
    const newPermission: any = await this.permissionModel.create({
      method,
      apiPath,
      name,
      module,
      createdBy: toObjectId(user?._id),
    });
    return {
      _id: newPermission._id,
      createdAt: newPermission.createdAt,
    };
  }
  async findAllByAdmin() {
    const result = await this.permissionModel.find().select({
      _id: 1,
    });
    const newResult = result.map((item) => item._id);
    return newResult;
  }
  async findAll({ page, limit }) {
    const skip = (page - 1) * limit;
    const result = await this.permissionModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("")
      .sort({ createdAt: "desc" });
    const totalItems = await this.permissionModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      meta: {
        current: page, // trang hiện tại
        pageSize: limit, // số lượng bản ghi đã lấy
        pages: totalPages, // tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, // kết quả query
    };
  }

  async findOne(id: string) {
    const resume = await this.permissionModel.findById(id).exec();
    if (!resume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }
    return resume;
  }

  async findByUser(user: IUser) {
    const resume = await this.permissionModel
      .find({
        userId: toObjectId(user._id),
      })
      .exec();
    return resume;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    const updatedResume = await this.permissionModel
      .findByIdAndUpdate(
        id,
        {
          ...updatePermissionDto,
          updatedBy: toObjectId(user._id),
        },
        { new: true },
      )
      .exec();
    if (!updatedResume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }
    return updatedResume;
  }

  async remove(id: string): Promise<void> {
    const deletedResume = await this.permissionModel.findByIdAndDelete(id).exec();
    if (!deletedResume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }
  }
}

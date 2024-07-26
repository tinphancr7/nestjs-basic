import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role, RoleDocument } from "./schemas/role.schema";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "src/users/users.interface";
import { toObjectId } from "src/utils";

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    const isExist = await this.RoleModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException("Role already exists");
    }
    const newRole: any = await this.RoleModel.create({
      name,
      description,
      isActive,
      permissions: permissions.map((permission) => toObjectId(permission)),
      createdBy: toObjectId(user?._id),
    });
    return {
      _id: newRole._id,
      createdAt: newRole.createdAt,
    };
  }

  async findAll({ page, limit }) {
    const skip = (page - 1) * limit;
    const result = await this.RoleModel.find().skip(skip).limit(limit).lean().populate("").sort({ createdAt: "desc" });
    const totalItems = await this.RoleModel.countDocuments();
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
    const role = await this.RoleModel.findById(id)
      .populate({
        path: "permissions",
        select: { _id: 1, name: 1, apiPath: 1, method: 1 },
      })
      .exec();

    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const updatedResume = await this.RoleModel.findByIdAndUpdate(
      id,
      {
        ...updateRoleDto,
        updatedBy: toObjectId(user._id),
      },
      { new: true },
    ).exec();
    if (!updatedResume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }
    return updatedResume;
  }

  async remove(id: string): Promise<void> {
    const deletedResume = await this.RoleModel.findByIdAndDelete(id).exec();
    if (!deletedResume) {
      throw new NotFoundException(`Resume with ID "${id}" not found`);
    }
  }
}

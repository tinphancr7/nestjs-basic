import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto, RegisterUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync } from "bcryptjs";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import * as bcrypt from "bcrypt";
import { IUser } from "./users.interface";

import { Role, RoleDocument } from "src/roles/schemas/role.schema";
import { USER_ROLE } from "src/constant";
import { toObjectId } from "src/utils";
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword = (password: string, hash: string) => {
    return hashSync(password, hash);
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto;
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException("email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: any = await this.userModel.create({
      name,
      email,
      age,
      gender,
      address,
      role: toObjectId(role),
      company: toObjectId(company),
      password: hashedPassword,
      createdBy: toObjectId(user?._id),
    });

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  async register(user: RegisterUserDto) {
    const existingUser = await this.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException("email already exists");
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    return await this.userModel.create({
      ...user,
      password: hashedPassword,
      role: userRole?._id,
    });
  }

  async findAll({ page, limit }) {
    const skip = (page - 1) * limit;
    const result = await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .populate([
        {
          path: "role",
        },
        {
          path: "company",
        },
      ])
      .sort({ createdAt: "desc" });
    const totalItems = await this.userModel.countDocuments();
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
    return await this.userModel.findById(id).populate([
      {
        path: "role",
      },
      {
        path: "company",
      },
    ]);
  }
  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email }).populate({
      path: "role",
      select: {
        name: 1,
      },
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(updateUserDto._id, { ...updateUserDto }, { new: true });
  }

  async remove(id: number) {
    const foundUser = await this.userModel.findById(id);
    if (foundUser?.email === "admin@gmail.com") {
      throw new BadRequestException("Not allowed to remove admin user");
    }
    return await this.userModel.softDelete({ _id: id });
  }

  async updateRefreshToken({ refresh_token, _id }) {
    return await this.userModel.findOneAndUpdate({ _id }, { refresh_token }, { new: true });
  }

  async findUserByToken(refresh_token: string) {
    return await this.userModel
      .findOne({
        refresh_token,
      })
      .populate({
        path: "role",
        select: {
          name: 1,
          _id: 1,
        },
      });
  }
}

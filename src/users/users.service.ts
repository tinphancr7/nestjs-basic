import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto, RegisterUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync } from "bcryptjs";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import * as bcrypt from "bcrypt";
import { IUser } from "./users.interface";
import { Types } from "mongoose";
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}
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
      role,
      company: new Types.ObjectId(company),
      password: hashedPassword,
      createdBy: new Types.ObjectId(user?._id),
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
    return await this.userModel.create({
      ...user,
      password: hashedPassword,
      role: "USER",
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(updateUserDto._id, { ...updateUserDto }, { new: true });
  }

  remove(id: number) {
    return this.userModel.softDelete({ _id: id });
  }
}

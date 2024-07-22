import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync } from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword = (password: string, hash: string) => {
    return hashSync(password, hash);
  };

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    const user = await this.userModel.create({ ...createUserDto, password: hashPassword });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(updateUserDto._id, { ...updateUserDto }, { new: true });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

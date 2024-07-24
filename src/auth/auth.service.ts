//auth.service.ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { UsersService } from "src/users/users.service";
import { User } from "src/users/schemas/user.schema";

import { CreateUserDto, RegisterUserDto } from "src/users/dto/create-user.dto";
import { IUser } from "src/users/users.interface";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Password does not match");
    }
    return user;
  }
  async login(user: IUser, response: Response) {
    const payload = {
      sub: "token login",
      iss: "server",
      ...user,
    };

    // create refresh token

    const refresh_token = this.createRefreshToken(payload);

    //set cookie
    response.cookie("refresh_token", refresh_token);

    return { access_token: this.jwtService.sign(payload), user };
  }
  async register(user: RegisterUserDto) {
    const newUser: any = await this.usersService.register(user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
    // const { _id, name, email, role } = newUser;
    // return this.login({ _id: _id.toString(), name, email, role });
  }

  createRefreshToken = (payload) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN"),
    });
    return refresh_token;
  };
}

import { Body, Controller, Post, Req, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

import { Public } from "./decorators/public.decorator";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response } from "express";
import { User } from "./decorators/user.decorator";
import { IUser } from "src/users/users.interface";
import { ResponseMessage } from "./decorators/response_message.decorator";
@Public()
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard("local"))
  @ResponseMessage("Login successful")
  @Post("login")
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { _id, name, email, role } = req.user;
    return this.authService.login({ _id, name, email, role }, response);
  }
  @ResponseMessage("Registration successful")
  @Post("register")
  async register(@Body() registerBody: RegisterUserDto) {
    return await this.authService.register(registerBody);
  }

  @Public()
  @ResponseMessage("Token refreshed successfully")
  @Post("refresh")
  async handleRefreshToken(@Req() request: any, @Res({ passthrough: true }) response: Response) {
    const refresh_token = request.cookies["refresh_token"];

    return await this.authService.processNewToken(refresh_token, response);
  }

  @ResponseMessage("Logout successful")
  @Post("logout")
  async handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return await this.authService.logout(user, response);
  }
}

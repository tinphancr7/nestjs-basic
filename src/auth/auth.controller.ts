import { Body, Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

import { Public } from "./decorators/public.decorator";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response } from "express";
@Public()
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { _id, name, email, role } = req.user;
    return this.authService.login({ _id, name, email, role }, response);
  }
  @Post("register")
  async register(@Body() registerBody: RegisterUserDto) {
    return await this.authService.register(registerBody);
  }
}

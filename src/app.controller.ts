import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { User } from "./auth/decorators/user.decorator";
import { IUser } from "./users/users.interface";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@User() user: IUser): Promise<string> {
    console.log("user", user);
    return this.appService.getHello();
  }
}

import { Controller, Get, Post, Body, Param, Delete, Query, Put, Logger } from "@nestjs/common";
import { SubscribersService } from "./subscribers.service";

import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";
import { UpdateSubscriberDto } from "./dto/update-subscriber.dto";
import { User } from "src/modules/auth/decorators/user.decorator";
import { IUser } from "src/modules/users/users.interface";
import { IsSkipPermission } from "src/modules/auth/decorators/skip_permission.decorator";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApiTags } from "@nestjs/swagger";

@Controller("subscribers")
@ApiTags("subscribers")
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}
  private logger = new Logger(); //will print this in context
  @Public()
  @Get()
  // @Cron(CronExpression.EVERY_30_SECONDS)
  @Cron("0 0 0 * * 0") //  00:00 am every sunday
  handleCron() {
    this.logger.debug("Called every 30 seconds");
  }
  @ResponseMessage("Subscriber successfully created")
  @Post()
  create(@Body() createSubscriberDto: CreateSubscriberDto) {
    return this.subscribersService.create(createSubscriberDto);
  }

  @ResponseMessage("Get subscribers's skills")
  @IsSkipPermission()
  @Post("skills")
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user);
  }

  @Public()
  @ResponseMessage("Subscribers successfully retrieved")
  @Get()
  findAll(@Query() query: any) {
    const { current = 1, pageSize = 10 } = query;

    return this.subscribersService.findAll({
      page: +current,
      limit: +pageSize,
    });
  }

  @Public()
  @ResponseMessage("Subscriber successfully retrieved")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subscribersService.findOne(id);
  }

  @ResponseMessage("Subscriber successfully updated")
  @IsSkipPermission()
  @Put()
  update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @ResponseMessage("Subscriber successfully deleted")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.subscribersService.remove(id);
  }
}

import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { User } from "src/auth/decorators/user.decorator";
import { IUser } from "src/users/users.interface";
import { ResponseMessage } from "src/auth/decorators/response_message.decorator";
import { Public } from "src/auth/decorators/public.decorator";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ResponseMessage("hello world!")
  @Get()
  findAll(@Query() query: any) {
    const { current = 1, pageSize = 10 } = query;
    return this.companiesService.findAll({
      page: +current,
      limit: +pageSize,
    });
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.companiesService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.companiesService.remove(id);
  }
}

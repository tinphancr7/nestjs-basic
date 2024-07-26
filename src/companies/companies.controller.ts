import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { User } from "src/auth/decorators/user.decorator";
import { IUser } from "src/users/users.interface";
import { ResponseMessage } from "src/auth/decorators/response_message.decorator";
import { Public } from "src/auth/decorators/public.decorator";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Public()
  @ResponseMessage("hello world!")
  @Get()
  findAll(@Query() query: any) {
    const { page = 1, limit = 10 } = query;
    return this.companiesService.findAll({
      page: +page,
      limit: +limit,
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

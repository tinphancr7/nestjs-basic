import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { User } from "src/auth/decorators/user.decorator";
import { IUser } from "src/users/users.interface";
import { ResponseMessage } from "src/auth/decorators/response_message.decorator";
import { Public } from "src/auth/decorators/public.decorator";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("companies")
@ApiTags("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage("Create a new company")
  @ApiOperation({
    summary: "Admin create new user",
    description: `
* Only admin can use this API

* Admin create user and give some specific information`,
  })
  @ApiBody({
    type: CreateCompanyDto,
    examples: {
      user_1: {
        value: {
          first_name: "John",
          last_name: "Doe",
          email: "johndoe@example.com",
          password: "1232@asdS",
        },
      },
      user_2: {
        value: {
          first_name: "Michael",
          last_name: "Smith",
          email: "michaelsmith@example.com",
          password: "1232@asdS",
        },
      },
    },
  })
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ResponseMessage("Fetch all companies with paginate")
  @Get()
  @ApiQuery({
    name: "current",
    type: Number,

    examples: {
      "1": {
        value: 1,
        description: "Start from page 1",
      },
      "10": {
        value: 10,
        description: `Start from page 10`,
      },
    },
  })
  @ApiQuery({
    name: "pageSize",
    type: Number,
    required: false,
    examples: {
      "10": {
        value: 10,
        description: `Get 10 collection`,
      },
      "50": {
        value: 50,
        description: `Get 50 collection`,
      },
    },
  })
  findAll(@Query() query: any) {
    const { current = 1, pageSize = 10 } = query;
    return this.companiesService.findAll({
      page: +current,
      limit: +pageSize,
    });
  }

  @Public()
  @ResponseMessage("Fetch a company by id")
  @ApiParam({
    name: "id",
    type: "string",
    examples: {
      migration_id_1: {
        value: "644293b09150e9f67d9bb75d",
        description: `Collection Kitchen vocabulary`,
      },
      migration_id_2: {
        value: "6442941027467f9a755ff76d",
        description: `Collection Sport vocabulary`,
      },
    },
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    console.log("id", id);
    return this.companiesService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update a company by id")
  update(@Param("id") id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a company by id")
  remove(@Param("id") id: string) {
    return this.companiesService.remove(id);
  }
}

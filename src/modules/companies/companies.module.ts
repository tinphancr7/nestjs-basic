import { Module } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CompaniesController } from "./companies.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Company, CompanySchema } from "./schemas/company.schema";
import { UsersModule } from "src/modules/users/users.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]), UsersModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "./auth/guards/jwt.guard";
import { JwtStrategy } from "./auth/strategy/jwt.strategy";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";
import { CompaniesModule } from "./companies/companies.module";

import { JobsModule } from "./jobs/jobs.module";
import { FilesModule } from "./files/files.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { RolesModule } from "./roles/roles.module";
import { ResumesModule } from "./resumes/resumes.module";

import { DatabasesModule } from "./databases/databases.module";
import { SubscribersModule } from "./subcribers/subscribers.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { HealthModule } from "./health/health.module";
import { MailModule } from "./mail/mail.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // MongooseModule.forRoot("mongodb+srv://phanthanhtincr7:totnghiep10@cluster0.8dij1zc.mongodb.net/nestjs-basic"),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 2,
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URL"),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    JobsModule,
    FilesModule,
    PermissionsModule,
    RolesModule,
    ResumesModule,

    DatabasesModule,
    SubscribersModule,
    HealthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },

    JwtStrategy,
  ],
})
export class AppModule {}

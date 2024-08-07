import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "./modules/auth/guards/jwt.guard";
import { JwtStrategy } from "./modules/auth/strategy/jwt.strategy";
import { softDeletePlugin } from "soft-delete-plugin-mongoose";
import { CompaniesModule } from "./modules/companies/companies.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { FilesModule } from "./modules/files/files.module";
import { PermissionsModule } from "./modules/permissions/permissions.module";
import { RolesModule } from "./modules/roles/roles.module";
import { ResumesModule } from "./modules/resumes/resumes.module";
import { DatabasesModule } from "./databases/databases.module";
import { SubscribersModule } from "./modules/subcribers/subscribers.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { HealthModule } from "./modules/health/health.module";
import { MailModule } from "./modules/mail/mail.module";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { CommentsModule } from "./modules/comments/comments.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    CommentsModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}

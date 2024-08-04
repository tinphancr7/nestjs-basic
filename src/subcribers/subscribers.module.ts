import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "src/users/users.module";
import { Subscriber, SubscriberSchema } from "./schemas/subscriber.schema";
import { SubscribersController } from "./subscribers.controller";
import { SubscribersService } from "./subscribers.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }]), UsersModule],
  controllers: [SubscribersController],
  providers: [SubscribersService],
})
export class SubscribersModule {}

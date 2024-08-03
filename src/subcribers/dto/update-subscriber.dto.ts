import { PartialType } from "@nestjs/mapped-types";
import { CreateSubscriberDto } from "./create-subscriber.dto";

export class UpdateSubscriberDto extends PartialType(CreateSubscriberDto) {}

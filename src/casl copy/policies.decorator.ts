// policies.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { PolicyHandler } from "./policy-handler.interface";

export const CHECK_POLICIES_KEY = "check_policy";
export const CheckPolicies = (...handlers: any) => SetMetadata(CHECK_POLICIES_KEY, handlers);

// policies.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { CHECK_POLICIES_KEY } from "./policies.decorator";
import { PolicyHandler, PolicyHandlerCallback } from "./policy-handler.interface";
import { AppAbility, CaslAbilityFactory } from "./casl-ability.factory/casl-ability.factory";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<(PolicyHandler | PolicyHandlerCallback)[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
  }

  private execPolicyHandler(handler: PolicyHandler | PolicyHandlerCallback, ability: AppAbility) {
    if (typeof handler === "function") {
      return (handler as PolicyHandlerCallback)(ability);
    }
    return (handler as PolicyHandler).handle(ability);
  }
}

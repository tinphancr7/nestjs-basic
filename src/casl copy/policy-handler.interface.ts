// policy-handler.interface.ts

import { AppAbility } from "./casl-ability.factory/casl-ability.factory";

export interface PolicyHandler {
  handle(ability: AppAbility): boolean;
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

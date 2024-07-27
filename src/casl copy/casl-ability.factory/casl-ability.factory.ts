// abilities.ts
import { AbilityBuilder, Ability, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "../action.enum";

import { Resume } from "src/resumes/schemas/resume.schema";

type Subjects = InferSubjects<typeof Resume> | "all";

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: any) {
    console.log("user", user);
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    if (user.role === "ADMIN") {
      console.log("okeeesaaaaa");
      can(Action.Manage, "all"); // Admins can manage everything
    } else {
      console.log("okeee");
      can(Action.Create, Resume); // Allow non-admin users to create resumes
      can(Action.Read, Resume);
      can(Action.Update, Resume, { createdBy: user._id });
      cannot(Action.Delete, Resume, { createdBy: user._id });
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

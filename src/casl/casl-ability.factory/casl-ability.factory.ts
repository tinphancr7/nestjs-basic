// abilities.ts
import { AbilityBuilder, Ability, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Resume } from "src/resumes/schemas/resume.schema";
import { User } from "src/users/schemas/user.schema";
import { permissions, subjectMap } from "../permissions.config";
import { Action } from "../action.enum";

type Subjects = InferSubjects<typeof Resume | typeof User> | "all";

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    const rolePermissions = permissions["user"] || {};

    for (const [subject, actions] of Object.entries(rolePermissions) as [string, Action[]][]) {
      const subjectType = subjectMap[subject];
      actions.forEach((action) => {
        if (action === Action.Manage) {
          can(Action.Manage, "all");
        } else {
          can(action as Action, subjectType as any);
        }
      });
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

// permissions.config.ts
import { Resume } from "src/resumes/schemas/resume.schema";
import { Action } from "./action.enum";
import { User } from "src/users/schemas/user.schema";

export const permissions = {
  admin: {
    all: [Action.Manage],
  },
  user: {
    [Resume.name]: [Action.Create, Action.Read, Action.Update],
    [User.name]: [Action.Read],
  },
  manager: {
    [Resume.name]: [Action.Read, Action.Update, Action.Delete],
    [User.name]: [Action.Read],
  },
  // Add more roles and modules as needed
};
export const subjectMap = {
  Resume: Resume,
  User: User,
};

import { SetMetadata } from "@nestjs/common";
export const IS_SKIP_PERMISSION = "isSkipPermission";
export const IsSkipPermission = () => SetMetadata(IS_SKIP_PERMISSION, true);

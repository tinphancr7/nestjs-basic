import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC } from "../decorators/public.decorator";
import { TokenExpiredError } from "@nestjs/jwt";
import { Request } from "express";
import { IS_SKIP_PERMISSION } from "../decorators/skip_permission.decorator";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC, [context.getHandler(), context.getClass()]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const isSkipPermission = this.reflector.getAllAndOverride<boolean>(IS_SKIP_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);
    // You can throw an exception based on either "info" or "err" arguments
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException("JWT token has expired");
    }
    if (err || !user) {
      throw err || new UnauthorizedException("Need a jwt token in header");
    }

    //check permission

    const targetMethod = request.method;
    const targetEndpoint = request?.route?.path as string;
    let isExist = user?.permissions.find(
      (permission) => permission.method === targetMethod && permission.apiPath === targetEndpoint,
    );
    if (targetEndpoint.startsWith("/api/v1/auth")) isExist = true;
    if (!isExist && !isSkipPermission) {
      throw new ForbiddenException("You are not allowed to access this resource");
    }
    return user;
  }
}

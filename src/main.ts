import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { TransformInterceptor } from "./core/transform.interceptor";
import cookieParser from "cookie-parser";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
async function bootstrap() {
  // request -> interceptor - > pipe (validate ) -> response
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  const publicPath = join(__dirname, "../public");

  app.useStaticAssets(publicPath);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: ["*"],
  });

  //config versioning
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1", "2"],
  });
  await app.listen(configService.get<string>("PORT"));
}
bootstrap();

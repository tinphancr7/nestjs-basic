import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { TransformInterceptor } from "./core/transform.interceptor";
import cookieParser from "cookie-parser";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";

import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { configSwagger } from "./configs/api-docs.config";
async function bootstrap() {
  // request -> interceptor - > pipe (validate ) -> response
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  const publicPath = join(__dirname, "../public");
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useStaticAssets(publicPath);
  app.use(cookieParser());
  const configService = app.get(ConfigService);

  // app.enableCors({
  //   origin: [
  //     // process.env.URL_UI,
  //     "http://localhost:3000",
  //     // 'http://localhost:5050',
  //     // 'https://lsport-ui.vercel.app/',
  //   ],
  //   optionsSuccessStatus: 200,
  //   credentials: true,
  // });

  app.enableCors({
    origin: true,
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    preflightContinue: false,
    credentials: true,
  });

  //config versioning
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
    // defaultVersion: ["1", "2"],
  });

  app.use(helmet());
  // const config = new DocumentBuilder()
  //   .setTitle("Cats example")
  //   .setDescription("The cats API description")
  //   .setVersion("1.0")
  //   .addTag("cats")
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup("api", app, document);

  configSwagger(app);
  app.useStaticAssets(join(__dirname, "./served")); // <-- Thêm vào đây
  app.useLogger(new Logger());
  app.use((req: Request, res: Response, next) => {
    new Logger().debug("===TRIGGER GLOBAL MIDDLEWARE==");
    next();
  });
  await app.listen(configService.get<string>("PORT"));
}
bootstrap();

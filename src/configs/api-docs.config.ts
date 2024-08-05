// import { INestApplication } from "@nestjs/common";
// import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// export function configSwagger(app: INestApplication) {
//   const config = new DocumentBuilder()
//     .setTitle("Flash card project")
//     .setDescription("## The flash card API description")
//     .setVersion("1.0")
//     // .addBearerAuth()
//     .addBearerAuth(
//       { type: "http", scheme: "bearer", bearerFormat: "JWT" },
//       "JWT-auth", // This name must match the @ApiBearerAuth() decorator name
//     )
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup("api-docs", app, document, {
//     swaggerOptions: { persistAuthorization: true },
//     customJs: "/swagger-custom.js", // <--- thêm vào đây
//   });
// }
import * as fs from "fs";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NextFunction, Request, Response } from "express";

const api_documentation_credentials = {
  name: "admin",
  pass: "admin",
};

export function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Nest JS Advanced Course for developers [2024]")
    .setDescription("## API description")
    .setVersion("1.0")
    // .addBearerAuth(
    //   { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    //   "JWT-auth", // This name must match the @ApiBearerAuth() decorator name
    // )
    .addSecurity("JWT-auth", { type: "http", scheme: "bearer" })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync("swagger.json", JSON.stringify(document)); // <-- Save document to json file
  const http_adapter = app.getHttpAdapter();
  http_adapter.use("/api-docs", (req: Request, res: Response, next: NextFunction) => {
    function parseAuthHeader(input: string): { name: string; pass: string } {
      const [, encodedPart] = input.split(" ");

      const buff = Buffer.from(encodedPart, "base64");
      const text = buff.toString("ascii");
      const [name, pass] = text.split(":");

      return { name, pass };
    }

    function unauthorizedResponse(): void {
      if (http_adapter.getType() === "fastify") {
        res.statusCode = 401;
        res.setHeader("WWW-Authenticate", "Basic");
      } else {
        res.status(401);
        res.set("WWW-Authenticate", "Basic");
      }

      next();
    }

    if (!req.headers.authorization) {
      return unauthorizedResponse();
    }

    const credentials = parseAuthHeader(req.headers.authorization);

    if (
      credentials?.name !== api_documentation_credentials.name ||
      credentials?.pass !== api_documentation_credentials.pass
    ) {
      return unauthorizedResponse();
    }

    next();
  });
  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
    customJs: "/swagger-custom.js",
  });
}

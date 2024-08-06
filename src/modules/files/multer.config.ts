import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import path, { join } from "path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  // Ensures that the directory exists, creates it if it doesn't
  ensureExists(dir: string): void {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  // Returns the root path of the project
  getRootPath(): string {
    return process.cwd();
  }
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.["folder_type"] ?? "default";
          this.ensureExists(`public/images/${folder}`);
          cb(null, join(this.getRootPath(), `public/images/${folder}`));
        },
        filename: (req, file, cb) => {
          // get image extension
          const extName = path.extname(file.originalname);

          // get image's name (without extension)
          const baseName = path.basename(file.originalname, extName);

          const finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
    };
  }
}

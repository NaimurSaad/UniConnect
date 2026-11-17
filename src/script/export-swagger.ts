import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@/src/app.module";
import * as fs from "fs";
import * as path from "path";

async function exportSwagger() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle("UniConnect Enterprise Platform API")
    .setDescription(
      "AIUB CSC4161 (Advanced Programming in Web Technology) — Complete API Specification for University Community Platform",
    )
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT access token",
        in: "header",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Output portably to project root (works on any OS / machine)
  const outPath = path.join(process.cwd(), "swagger.json");
  fs.writeFileSync(outPath, JSON.stringify(document, null, 2), "utf8");
  console.log("Successfully exported swagger.json to:", outPath);

  // Optional: mirror to sibling 'res' folder if it exists on the host
  const resDir = path.join(process.cwd(), "..", "res");
  if (fs.existsSync(resDir)) {
    fs.writeFileSync(path.join(resDir, "swagger.json"), JSON.stringify(document, null, 2), "utf8");
    console.log("Mirrored swagger.json to:", path.join(resDir, "swagger.json"));
  }
  await app.close();
  process.exit(0);
}

exportSwagger().catch((err) => {
  console.error("Error exporting swagger:", err);
  process.exit(1);
});

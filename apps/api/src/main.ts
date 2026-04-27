import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableCors({
    origin: env.WEB_ORIGIN ? env.WEB_ORIGIN.split(",") : true,
    credentials: true
  });

  await app.listen(env.PORT);
}

void bootstrap();

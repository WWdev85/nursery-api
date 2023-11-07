import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app)

  await app.listen(3000);
}
bootstrap();

export async function createNestServer(expressInstance: express.Express): Promise<any> {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );
  appConfig(app)
  return app.init();
}

const appConfig = (app: INestApplication<any>) => {

  const config = new DocumentBuilder()
    .setTitle('Nursery API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
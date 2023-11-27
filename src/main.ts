import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';


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

  app.useGlobalPipes(new ValidationPipe(
    {
      // disableErrorMessages: true,

      whitelist: true,
      forbidNonWhitelisted: true,

      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }

  ));

  app.use(cookieParser());

  app.use(cors({
    origin: ['http://localhost:3000', 'https://admin.webcarver20.usermd.net', 'https://api.webcarver20.usermd.net/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }))
}
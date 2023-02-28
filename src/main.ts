import { NestFactory, Reflector } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import '@shopify/shopify-api/adapters/node';
import { WsAdapter } from '@nestjs/platform-ws';

import { AppModule } from '@src/app.module';
import { JwtAuthGuard } from './auth/passport-strategy.guard';
import { RedisIoAdapter } from './adapters/socket-io.adapter';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error'],
    cors: true,
  });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.use(cookieParser());
  app.use(helmet());

  // Default Web Socket
  // app.useWebSocketAdapter(new WsAdapter(app));
  const socketAdapter = new IoAdapter(app);
  // await socketAdapter.createIOServer(5050);
  app.useWebSocketAdapter(socketAdapter);

  const config = new DocumentBuilder()
    .setTitle('Nest.js Boiler Plate')
    .setDescription('Swagger API description')
    .setVersion('1.0')
    .addTag('boilerplate')
    .addBearerAuth()
    .addGlobalParameters()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  // {URL+PORT}/swagger
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

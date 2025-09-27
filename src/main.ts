import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const appConfig = AppConfig(configService);

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //   }),
  // );

  // Enable CORS
  app.enableCors({
    origin: appConfig.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // API Documentation setup
  const config = new DocumentBuilder()
    .setTitle('BLUSALT DRONE LOGISTICS API')
    .setDescription('BLUSALT DRONE LOGISTICS API DOCUMENTATION')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.port);
  logger.log(
    `🚀🚀🚀 Application is running on: http://localhost:${appConfig.port}/api/v1`,
  );
  logger.log(
    `API Documentation available at: http://localhost:${appConfig.port}/api`,
  );
}
bootstrap().catch((error) => {
  console.error('Error starting the server:', error);
  process.exit(1);
});
